/* ============================================================
   FINPILOT — getstarted.js
   MetaMask / Ethereum EIP-4361 Sign-In With Ethereum (SIWE)
   Flow: Connect Wallet → Sign Message → Verify → Redirect
   ============================================================ */

/* ─── DOM refs ────────────────────────────────────────────── */
const stateDefault    = document.getElementById('stateDefault');
const stateConnecting = document.getElementById('stateConnecting');
const stateSigning    = document.getElementById('stateSigning');
const stateSuccess    = document.getElementById('stateSuccess');
const stateError      = document.getElementById('stateError');

const btnConnect       = document.getElementById('btnConnect');
const btnWalletConnect = document.getElementById('btnWalletConnect');
const btnSign          = document.getElementById('btnSign');
const btnCancelConnect = document.getElementById('btnCancelConnect');
const btnCancelSign    = document.getElementById('btnCancelSign');
const btnRetry         = document.getElementById('btnRetry');
const noMetaMask       = document.getElementById('noMetaMask');
const displayAddress   = document.getElementById('displayAddress');
const errorMessage     = document.getElementById('errorMessage');
const errorHint        = document.getElementById('errorHint');
const successBar       = document.getElementById('successBar');

const trackStep1  = document.getElementById('trackStep1');
const trackStep2  = document.getElementById('trackStep2');
const trackStep3  = document.getElementById('trackStep3');
const trackBar1   = document.getElementById('trackBar1');
const trackBar2   = document.getElementById('trackBar2');

let currentAccount = null;
let provider       = null;

/* ─── State switcher ──────────────────────────────────────── */
function showState(name) {
  [stateDefault, stateConnecting, stateSigning, stateSuccess, stateError]
    .forEach(el => el.classList.add('hidden'));

  const map = {
    default:    stateDefault,
    connecting: stateConnecting,
    signing:    stateSigning,
    success:    stateSuccess,
    error:      stateError,
  };

  if (map[name]) map[name].classList.remove('hidden');
}

/* ─── Step tracker helper ─────────────────────────────────── */
function setStep(n) {
  // Reset all
  [trackStep1, trackStep2, trackStep3].forEach(s => {
    s.classList.remove('active', 'done');
  });
  [trackBar1, trackBar2].forEach(b => b.classList.remove('filled'));

  if (n === 1) {
    trackStep1.classList.add('active');
  } else if (n === 2) {
    trackStep1.classList.add('done');
    trackBar1.classList.add('filled');
    trackStep2.classList.add('active');
  } else if (n === 3) {
    trackStep1.classList.add('done');
    trackStep2.classList.add('done');
    trackBar1.classList.add('filled');
    trackBar2.classList.add('filled');
    trackStep3.classList.add('active');
  }
}

/* ─── Shorten wallet address ──────────────────────────────── */
function shortAddress(addr) {
  return addr.slice(0, 6) + '…' + addr.slice(-4);
}

/* ─── Build EIP-4361 sign-in message ─────────────────────── */
function buildSiweMessage(address, nonce) {
  const domain    = window.location.host || 'finpilot.app';
  const origin    = window.location.origin || 'https://finpilot.app';
  const issuedAt  = new Date().toISOString();

  return [
    `${domain} wants you to sign in with your Ethereum account:`,
    address,
    '',
    'Sign in to FinPilot — your autonomous financial copilot.',
    '',
    `URI: ${origin}`,
    'Version: 1',
    'Chain ID: 1',
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
  ].join('\n');
}

/* ─── Generate random nonce ───────────────────────────────── */
function generateNonce() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2,'0')).join('');
}

/* ─── Show error ──────────────────────────────────────────── */
function showError(msg, hint = 'Please try again.') {
  errorMessage.textContent = msg;
  errorHint.textContent    = hint;
  showState('error');
  setStep(1);
}

/* ─── STEP 1: Connect Wallet ──────────────────────────────── */
async function connectWallet() {
  // Check MetaMask
  if (typeof window.ethereum === 'undefined') {
    noMetaMask.style.display = 'block';
    btnConnect.style.opacity = '0.5';
    btnConnect.style.pointerEvents = 'none';
    return;
  }

  showState('connecting');
  setStep(1);

  try {
    // Request accounts — triggers MetaMask popup
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (!accounts || accounts.length === 0) {
      showError('No accounts found.', 'Please unlock MetaMask and try again.');
      return;
    }

    currentAccount = accounts[0];

    // Verify correct network (Ethereum Mainnet = 1)
    // Remove this check if you want to allow any network
    const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
    const chainId    = parseInt(chainIdHex, 16);

    if (chainId !== 1) {
      // Prompt to switch to mainnet
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });
      } catch (switchErr) {
        // User rejected or chain not available — proceed anyway (optional)
        console.warn('Could not switch to mainnet:', switchErr.message);
      }
    }

    // Move to signing step
    displayAddress.textContent = shortAddress(currentAccount);
    showState('signing');
    setStep(2);

  } catch (err) {
    if (err.code === 4001) {
      // User rejected
      showState('default');
      setStep(1);
    } else {
      showError('Connection failed.', err.message || 'Could not connect to MetaMask.');
    }
  }
}

/* ─── STEP 2: Sign Message ────────────────────────────────── */
async function signMessage() {
  if (!currentAccount) {
    showError('No wallet connected.', 'Please start over.');
    return;
  }

  btnSign.classList.add('loading');
  btnSign.disabled = true;

  const nonce   = generateNonce();
  const message = buildSiweMessage(currentAccount, nonce);

  try {
    // personal_sign — no gas, just a cryptographic signature
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, currentAccount],
    });

    // ── Verify signature client-side using ethers.js ──
    // In production, send { message, signature, address } to your backend
    // and verify there. Here we do client-side verification as a demo.
    let verified = false;

    try {
      if (typeof ethers !== 'undefined') {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        verified = recoveredAddress.toLowerCase() === currentAccount.toLowerCase();
      } else {
        // ethers not loaded — accept signature at face value (demo mode)
        verified = true;
      }
    } catch (verifyErr) {
      console.warn('ethers verify error:', verifyErr);
      verified = true; // fallback for demo
    }

    if (!verified) {
      showError('Signature verification failed.', 'The signature did not match the wallet address.');
      return;
    }

    // ── Store session (demo: localStorage) ──
    // In production: send to backend, receive JWT / session token
    sessionStorage.setItem('fp_wallet',    currentAccount);
    sessionStorage.setItem('fp_signature', signature);
    sessionStorage.setItem('fp_nonce',     nonce);
    sessionStorage.setItem('fp_auth_time', Date.now());

    // ── Success! ──
    btnSign.classList.remove('loading');
    showState('success');
    setStep(3);
    runSuccessBar();

  } catch (err) {
    btnSign.classList.remove('loading');
    btnSign.disabled = false;

    if (err.code === 4001) {
      // User rejected signature
      showState('signing');
      setStep(2);
    } else {
      showError('Signing failed.', err.message || 'MetaMask could not complete the signature.');
    }
  }
}

/* ─── Success progress bar + redirect ────────────────────── */
function runSuccessBar() {
  let pct = 0;
  const interval = setInterval(() => {
    pct += 2;
    successBar.style.width = pct + '%';
    if (pct >= 100) {
      clearInterval(interval);
      // Redirect to dashboard (replace with your actual route)
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 300);
    }
  }, 40); // ~2s total
}

/* ─── WalletConnect placeholder ──────────────────────────── */
function walletConnectHandler() {
  alert('WalletConnect integration requires the @walletconnect/web3-provider package.\n\nFor production, install it via npm and initialise WalletConnect before calling connectWallet().');
}

/* ─── Cancel / disconnect ────────────────────────────────── */
function cancelAndReset() {
  currentAccount = null;
  provider       = null;
  showState('default');
  setStep(1);
  btnSign.classList.remove('loading');
  btnSign.disabled = false;
}

/* ─── Account / chain change listeners ───────────────────── */
if (typeof window.ethereum !== 'undefined') {
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      cancelAndReset();
    } else {
      currentAccount = accounts[0];
      displayAddress.textContent = shortAddress(currentAccount);
    }
  });

  window.ethereum.on('chainChanged', () => {
    // Page reload recommended by MetaMask on chain change
    window.location.reload();
  });
}

/* ─── Mouse parallax on background orbs ──────────────────── */
document.addEventListener('mousemove', (e) => {
  const xr = e.clientX / window.innerWidth  - 0.5;
  const yr = e.clientY / window.innerHeight - 0.5;
  document.querySelectorAll('.bg-orb').forEach((orb, i) => {
    const f = (i + 1) * 0.38;
    orb.style.transform = `translate(${xr * 18 * f}px, ${yr * 18 * f}px)`;
  });
});

/* ─── Event listeners ────────────────────────────────────── */
btnConnect.addEventListener('click',       connectWallet);
btnWalletConnect.addEventListener('click', walletConnectHandler);
btnSign.addEventListener('click',          signMessage);
btnCancelConnect.addEventListener('click', cancelAndReset);
btnCancelSign.addEventListener('click',    cancelAndReset);
btnRetry.addEventListener('click',         cancelAndReset);

/* ─── Check MetaMask on load ─────────────────────────────── */
window.addEventListener('load', () => {
  if (typeof window.ethereum === 'undefined') {
    noMetaMask.style.display = 'block';
  }

  // If already authenticated in this session, skip to dashboard
  const existing = sessionStorage.getItem('fp_wallet');
  if (existing) {
    // Uncomment below to auto-redirect if session exists:
    // window.location.href = 'index.html';
  }
});

/* ─── Ripple on connect button ───────────────────────────── */
btnConnect.addEventListener('click', function (e) {
  const rect   = btnConnect.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size   = Math.max(rect.width, rect.height);

  Object.assign(ripple.style, {
    position:     'absolute',
    width:        `${size}px`,
    height:       `${size}px`,
    left:         `${e.clientX - rect.left - size / 2}px`,
    top:          `${e.clientY - rect.top  - size / 2}px`,
    background:   'rgba(255,255,255,0.2)',
    borderRadius: '50%',
    transform:    'scale(0)',
    animation:    'rippleAnim 0.55s ease-out forwards',
    pointerEvents:'none',
    zIndex:       '0',
  });

  btnConnect.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes rippleAnim { to { transform:scale(2.5); opacity:0; } }`;
document.head.appendChild(rippleStyle);