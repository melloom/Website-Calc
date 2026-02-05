/**
 * Single source of truth for quote localStorage and URL params.
 * Use this so storage key and URL building stay consistent across all steps.
 */

/** localStorage key for the full quote selections object */
export const STORAGE_KEY = 'mellow-quote-selections';

/**
 * Step keys in the selections object (for reference; pages use step1, step2, etc.)
 * step1: Website Type (index)
 * step2: Category (step-2)
 * step3: Subcategory (step-4)
 * step5: Backend yes/no (step-5)
 * step6: Backend options (step-6)
 * step7: AI features (step-6)
 * step8: Store (step-8, step-8-options)
 * step9: Sections/Pages (step-9)
 * step10: Add-ons (10.js) or budget add-ons (step-3)
 * step11: Hosting & Domain (step-11)
 * step12: Maintenance (step-12)
 * step14: Automation features (step-7) — note: no step13 key
 */

/**
 * Build the bundle query string to append to URLs so bundle state is preserved.
 * All step pages should use this with their router.query so params stay consistent.
 * @param {Object} q - router.query (or object with bundle, bp_*)
 * @param {{ addStoreAddon?: boolean }} [opts] - optional: step-8 adds storeAddon
 * @returns {string} e.g. "&bundle=xyz&bp_backend=...&bp_ai=..."
 */
export function buildBundleParams(q, opts = {}) {
  if (!q || typeof q !== 'object') return '';
  const bundle = q.bundle || '';
  const bpBackend = q.bp_backend || '';
  const bpBackendOptions = q.bp_backendOptions || '';
  const bpAi = q.bp_ai || '';
  const bpAiFeatures = q.bp_aiFeatures || '';
  const bpAutomation = q.bp_automation || '';
  const bpAutomationFeatures = q.bp_automationFeatures || '';
  const bpStore = q.bp_store || '';
  const bpStoreOptions = q.bp_storeOptions || '';
  const bpSections = q.bp_sections || '';
  const bpAddons = q.bp_addons || '';
  const bpHosting = q.bp_hosting || '';
  const bpMaintenance = q.bp_maintenance || '';
  const parts = [
    bundle ? `bundle=${encodeURIComponent(bundle)}` : '',
    `bp_backend=${encodeURIComponent(bpBackend)}`,
    `bp_backendOptions=${encodeURIComponent(bpBackendOptions)}`,
    `bp_ai=${encodeURIComponent(bpAi)}`,
    `bp_aiFeatures=${encodeURIComponent(bpAiFeatures)}`,
    `bp_automation=${encodeURIComponent(bpAutomation)}`,
    `bp_automationFeatures=${encodeURIComponent(bpAutomationFeatures)}`,
    `bp_store=${encodeURIComponent(bpStore)}`,
    `bp_storeOptions=${encodeURIComponent(bpStoreOptions)}`,
    `bp_sections=${encodeURIComponent(bpSections)}`,
    `bp_addons=${encodeURIComponent(bpAddons)}`,
    `bp_hosting=${encodeURIComponent(bpHosting)}`,
    `bp_maintenance=${encodeURIComponent(bpMaintenance)}`
  ];
  const str = parts.filter(Boolean).join('&');
  const prefix = str ? '&' : '';
  const storeAddon = opts.addStoreAddon === true ? '&storeAddon=true' : (opts.addStoreAddon === false ? '' : (q.storeAddon === 'true' ? '&storeAddon=true' : ''));
  return prefix + str + storeAddon;
}

/**
 * Get current selections from storage (client-safe). Returns {} if not found or SSR.
 * @param {typeof localStorage} [storage] - optional; pass safeLocalStorage() or localStorage
 */
export function getQuoteSelections(storage) {
  if (typeof storage !== 'undefined' && storage && typeof storage.getItem === 'function') {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }
  return {};
}

/**
 * Write full selections to storage. Merges with existing if you pass a partial object (only overwrites keys you pass).
 * @param {Object} selections - full or partial selections object (e.g. { step1: {...} })
 * @param {typeof localStorage} [storage] - optional
 */
export function setQuoteSelections(selections, storage) {
  const target = typeof storage !== 'undefined' && storage && typeof storage.setItem === 'function'
    ? storage
    : typeof window !== 'undefined' ? window.localStorage : null;
  if (!target) return;
  try {
    const existing = getQuoteSelections(target);
    const merged = { ...existing, ...selections };
    target.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch (e) {
    console.warn('quote-storage: setQuoteSelections failed', e);
  }
}

/**
 * Update a single step in storage and save. Use this to avoid overwriting other steps.
 * @param {number} stepKey - e.g. 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 14
 * @param {Object|null} data - step data object, or null to remove that step
 * @param {typeof localStorage} [storage] - optional
 */
export function mergeQuoteStep(stepKey, data, storage) {
  const target = typeof storage !== 'undefined' && storage && typeof storage.setItem === 'function'
    ? storage
    : typeof window !== 'undefined' ? window.localStorage : null;
  if (!target) return;
  try {
    const existing = getQuoteSelections(target);
    const key = `step${stepKey}`;
    if (data == null) {
      delete existing[key];
    } else {
      existing[key] = { ...data, step: stepKey };
    }
    target.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('quote-storage: mergeQuoteStep failed', e);
  }
}
