// ===============================================
// MAIN APPLICATION - INITIALIZATION AND RENDERING
// ===============================================

class DevicePoliciesApp {
    constructor() {
        this.data = window.DATA;
        this.init();
    }

    init() {
        this.renderServicePolicies();
        this.renderCoveragePolicies();
        this.renderIPAddressSpaces();
        
        // Initialize accordion
        window.accordion = new Accordion();
        
        // Initialize toggle switches
        ToggleSwitch.init();
    }

    // ===============================================
    // SERVICE POLICIES
    // ===============================================
    renderServicePolicies() {
        const container = document.getElementById('service-policies');
        
        container.innerHTML = `
            <p class="table-description">
                Service policies help you to control your devices' connectivity options (in- and outgoing connectivity). In order to adjust and save your device 
                settings depending on the demands of a particular use case, we recommend creating one policy per use case or device type.
            </p>
            
            <div class="table-header-row">
                <div></div>
                <button class="btn btn-primary">New service policy</button>
            </div>
            
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Attached devices</th>
                            <th>Breakout region</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.data.servicePolicies.map(policy => this.renderServicePolicyRow(policy)).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Add click handlers for rows
        container.querySelectorAll('.policy-row').forEach(row => {
            row.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const policyId = row.dataset.policyId;
                    DetailsPanel.toggleRow(row, policyId, 'service');
                }
            });
        });
    }

    renderServicePolicyRow(policy) {
        const regionIcon = policy.breakoutRegion.icon === 'globe' 
            ? `<svg class="region-icon globe" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
               </svg>`
            : `<svg class="region-icon vpn" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
               </svg>`;

        return `
            <tr class="policy-row clickable" data-policy-id="${policy.id}">
                <td class="cell-id">${policy.id}</td>
                <td class="cell-name">${policy.name}</td>
                <td class="cell-count">${policy.attachedDevices !== null ? policy.attachedDevices : '-'}</td>
                <td>
                    <div class="cell-region">
                        ${regionIcon}
                        <span>${policy.breakoutRegion.name}</span>
                    </div>
                </td>
            </tr>
            <tr class="detail-row hidden" id="service-detail-row-${policy.id}">
                <td colspan="4">
                    ${this.renderServicePolicyDetail(policy)}
                </td>
            </tr>
        `;
    }

    renderServicePolicyDetail(policy) {
        const d = policy.details;
        
        return `
            <div class="detail-panel">
                <div class="detail-panel-header">
                    <div class="detail-panel-title">
                        <h3>${policy.name}</h3>
                        <svg class="edit-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </div>
                    <div class="detail-panel-meta">
                        <span class="meta-text">Allows code: 0 SMS</span>
                        <span class="edit-icon-small">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </span>
                        <a href="#" class="link-with-icon">
                            ${policy.attachedDevices || 0} devices
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    </div>
                </div>
                
                <div class="detail-panel-body">
                    <div class="settings-grid">
                        <!-- Data Settings -->
                        <div class="settings-section">
                            <h4 class="settings-section-title">Data</h4>
                            
                            <div class="setting-row">
                                <div class="setting-info">
                                    <span class="setting-label">
                                        Internet breakout region
                                        <svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="16" x2="12" y2="12"></line>
                                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                        </svg>
                                    </span>
                                </div>
                                <div class="setting-action">
                                    <span class="region-badge">${d.data.internetBreakoutRegion}</span>
                                    <span class="edit-link">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            
                            <div class="setting-row">
                                <div class="setting-info">
                                    <span class="setting-label">Devices may use data</span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" ${d.data.cellularConnectivity ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            
                            <div class="subsection-header">CELLULAR CONNECTIVITY</div>
                            
                            <div class="rat-checkboxes">
                                <label class="checkbox-group">
                                    <input type="checkbox" class="checkbox-input" ${d.data.ratTypes['2G'] ? 'checked' : ''}>
                                    <span class="checkbox-label">2G</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" class="checkbox-input" ${d.data.ratTypes['3G'] ? 'checked' : ''}>
                                    <span class="checkbox-label">3G UMTS</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" class="checkbox-input" ${d.data.ratTypes['4G/LTE'] ? 'checked' : ''}>
                                    <span class="checkbox-label">4G LTE/LTE-M</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" class="checkbox-input" ${d.data.ratTypes['NB-IoT'] ? 'checked' : ''}>
                                    <span class="checkbox-label">NB-IoT</span>
                                </label>
                            </div>
                            
                            <div class="setting-row" style="margin-top: 16px;">
                                <div class="setting-info">
                                    <span class="setting-label">Satellite connectivity</span>
                                </div>
                                <div class="setting-action">
                                    <span class="tag tag-gray">NB-IoT (GEO)</span>
                                    <label class="toggle-switch">
                                        <input type="checkbox" ${d.data.satelliteConnectivity ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="separator"></div>
                            
                            <div class="setting-row">
                                <div class="setting-info">
                                    <span class="setting-label-large">${d.data.usageLimit || 'No limit'}</span>
                                    <span class="setting-value">Cellular data limit</span>
                                </div>
                                <span class="edit-link">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </span>
                            </div>
                            
                            <div class="setting-row">
                                <div class="setting-info">
                                    <span class="setting-label">Soft limit</span>
                                    <span class="setting-value">Event is triggered at <a href="#" class="inline-link">${d.data.softLimitThreshold || '70%'}</a></span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" ${d.data.softLimit ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            
                            <div class="separator"></div>
                            
                            <div class="setting-row">
                                <div class="setting-info">
                                    <span class="setting-label">Custom DNS Server</span>
                                    ${d.data.customDns.enabled 
                                        ? `<span class="setting-value">Primary IP: ${d.data.customDns.primary} · Secondary IP: ${d.data.customDns.secondary}</span>` 
                                        : '<span class="setting-value">Using default Google DNS</span>'}
                                </div>
                                <span class="configured-badge">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Configured DNS
                                </span>
                            </div>
                            
                            <div class="separator"></div>
                            
                            <div class="setting-row">
                                <div class="setting-info">
                                    <span class="setting-label">
                                        Data Quota
                                        <svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="16" x2="12" y2="12"></line>
                                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                        </svg>
                                    </span>
                                    <span class="setting-value">Set a quota for devices</span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" ${d.data.dataQuota.enabled ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        
                        <!-- SMS Settings -->
                        <div class="settings-section">
                            <h4 class="settings-section-title">SMS</h4>
                            
                            <div class="setting-row">
                                <div class="setting-info">
                                    <span class="setting-label">SMS interface</span>
                                </div>
                                <div class="setting-action">
                                    <span class="interface-value">${d.sms.interface}</span>
                                    <span class="edit-link">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            
                            <div class="setting-row">
                                <div class="setting-info">
                                    <span class="setting-label">SMS outbound</span>
                                </div>
                                <div class="setting-action">
                                    ${d.sms.outboundLimit ? `
                                        <select class="form-select form-select-sm">
                                            <option selected>${d.sms.outboundLimit}</option>
                                        </select>
                                    ` : ''}
                                    <label class="toggle-switch">
                                        <input type="checkbox" ${d.sms.outbound ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="setting-row">
                                <div class="setting-info">
                                    <span class="setting-label">SMS inbound</span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" ${d.sms.inbound ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            
                            <div class="separator"></div>
                            
                            <div class="subsection-header">SMS PERMISSIONS</div>
                            
                            <div class="setting-row">
                                <div class="setting-info">
                                    <span class="setting-label">
                                        <svg class="permission-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                        Device to Device SMS
                                    </span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" ${d.sms.permissions.deviceToDevice ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            
                            <div class="setting-row">
                                <div class="setting-info">
                                    <span class="setting-label">
                                        <svg class="permission-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="2" y1="12" x2="22" y2="12"></line>
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                        </svg>
                                        External SMS
                                    </span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" ${d.sms.permissions.external ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            
                            <div class="separator"></div>
                            
                            <div class="setting-row">
                                <div class="setting-info">
                                    <span class="setting-label">
                                        SMS Quota
                                        <svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="16" x2="12" y2="12"></line>
                                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                        </svg>
                                    </span>
                                    <span class="setting-value">Set a quota for devices</span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" ${d.sms.quota.enabled ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===============================================
    // COVERAGE POLICIES
    // ===============================================
    renderCoveragePolicies() {
        const container = document.getElementById('coverage-policies');
        
        container.innerHTML = `
            <p class="table-description">
                Coverage policies allow you to control where your devices will be able to connect to a network and where they will be denied access. By 
                creating multiple policies you can differentiate between device types depending on their coverage needs and the associated costs. For 
                instance, for a given product, specific areas can be disabled in order to prevent data usage in expensive or unplanned regions.
            </p>
            
            <div class="table-header-row">
                <div></div>
                <button class="btn btn-primary">New coverage policy</button>
            </div>
            
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Attached devices</th>
                            <th>Data allowance</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.data.coveragePolicies.map(policy => this.renderCoveragePolicyRow(policy)).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Add click handlers for details buttons
        container.querySelectorAll('.details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const policyId = btn.dataset.policyId;
                const detailSection = document.getElementById(`coverage-detail-${policyId}`);
                
                if (detailSection) {
                    const isHidden = detailSection.classList.contains('hidden');
                    detailSection.classList.toggle('hidden');
                    btn.classList.toggle('open');
                    
                    // Refresh accordion height
                    const section = container.closest('.accordion-section');
                    if (section && window.accordion) {
                        setTimeout(() => window.accordion.refresh(section), 50);
                    }
                }
            });
        });
    }

    renderCoveragePolicyRow(policy) {
        return `
            <tr>
                <td class="cell-id">${policy.id}</td>
                <td class="cell-name">
                    <span style="display: flex; align-items: center; gap: 8px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 20h22M3 20v-4M7 20V8M11 20V4M15 20V8M19 20v-4"></path>
                        </svg>
                        ${policy.name}
                    </span>
                </td>
                <td class="cell-count">${policy.attachedDevices} devices</td>
                <td>${policy.dataAllowance}</td>
                <td>
                    <button class="details-btn" data-policy-id="${policy.id}">
                        Details
                        <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                </td>
            </tr>
            <tr>
                <td colspan="5" style="padding: 0; border: none;">
                    <div id="coverage-detail-${policy.id}" class="hidden">
                        ${this.renderCoveragePolicyDetail(policy)}
                    </div>
                </td>
            </tr>
        `;
    }

    renderCoveragePolicyDetail(policy) {
        const d = policy.details;
        
        return `
            <div class="detail-panel" style="margin: 16px 0;">
                <div class="detail-panel-header">
                    <div class="detail-panel-title">
                        <h3>${policy.name}</h3>
                        <svg class="edit-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </div>
                    <div class="detail-panel-meta">
                        <a href="#" class="link-with-icon">
                            137 devices
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    </div>
                </div>
                
                <div class="detail-panel-body">
                    <div class="setting-row">
                        <div class="setting-info">
                            <span class="setting-label">Data Plan</span>
                            <span class="setting-value">${policy.dataPlan}</span>
                        </div>
                        <span class="edit-link">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </span>
                    </div>
                    
                    <div class="subsection-header">INCLUDED COVERAGE</div>
                    <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
                        These are free zones included in your coverage. Bank upon whichever areas will be at the cost 
                        according to your data plan rates and allowances. For for details on your Data Allowance, 
                        please check your subscription plan on the subscription page or <a href="#">click here</a>
                    </p>
                    
                    ${d.includedCoverage.map(zone => `
                        <div class="zone-card zone-card-included">
                            <div class="zone-info">
                                <label class="toggle-switch">
                                    <input type="checkbox" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                                <div class="zone-details">
                                    <div class="zone-name-row">
                                        <span class="zone-name">${zone.zone}</span>
                                        <span class="zone-count-badge">${zone.countryCount}</span>
                                        <span class="zone-flag-list">» EU + CH + NO</span>
                                    </div>
                                </div>
                            </div>
                            <div class="zone-prices">
                                <div class="zone-price">${zone.dataPrice}</div>
                                <div class="zone-price-detail">${zone.priceRange}</div>
                                <div class="zone-price-detail">${zone.smsPriceRange}</div>
                            </div>
                        </div>
                    `).join('')}
                    
                    <div class="subsection-header" style="margin-top: 24px;">ADDITIONAL COVERAGE</div>
                    <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
                        You can expand your coverage scope by activating the areas below. The data used in those 
                        countries will count towards your Allowance, and special rates will be applied.
                    </p>
                    
                    ${d.additionalCoverage.map(zone => `
                        <div class="zone-card zone-card-additional ${zone.enabled ? 'enabled' : ''}">
                            <div class="zone-info">
                                <label class="toggle-switch">
                                    <input type="checkbox" ${zone.enabled ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                                <div class="zone-details">
                                    <div class="zone-name-row">
                                        <span class="zone-name">${zone.zone}</span>
                                    </div>
                                    <div class="zone-countries">
                                        <span class="zone-count-badge zone-count-gray">${zone.countryCount}</span>
                                        <span class="zone-flags">${zone.countries.map(c => `<span class="zone-flag">${this.getFlagEmoji(c)}</span>`).join('')}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="zone-prices">
                                <div class="zone-price">${zone.dataPrice}</div>
                                <div class="zone-price-detail">${zone.priceRange}</div>
                                <div class="zone-price-detail">${zone.smsPriceRange}</div>
                            </div>
                        </div>
                    `).join('')}
                    
                    <!-- Coverage Map -->
                    <div class="coverage-map-container">
                        <h4 class="coverage-map-title">Coverage map</h4>
                        <div class="coverage-map">
                            <svg viewBox="0 0 800 400" style="width: 100%; height: 100%;">
                                ${this.renderWorldMapSVG()}
                            </svg>
                            <div class="coverage-map-legend">
                                <div class="legend-item">
                                    <span class="legend-color included"></span>
                                    <span>In selected coverage</span>
                                </div>
                                <div class="legend-item">
                                    <span class="legend-color not-included"></span>
                                    <span>Zone Plans available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Coverage List -->
                    <h4 class="coverage-list-title">Coverage list</h4>
                    <div class="coverage-list-header">
                        <div class="coverage-search">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input type="text" placeholder="Search...">
                        </div>
                        <div class="coverage-tabs">
                            <button class="coverage-tab active">By Country</button>
                            <button class="coverage-tab">By Coverage Zone</button>
                        </div>
                    </div>
                    
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Country</th>
                                    <th>Available network(s)</th>
                                    <th>Enabled network(s)</th>
                                    <th>Direct network(s)</th>
                                    <th>Direct radio access type(s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.data.countries.map(country => `
                                    <tr>
                                        <td>
                                            <div class="country-cell">
                                                <span style="font-size: 18px;">${country.flag}</span>
                                                <span>${country.name}</span>
                                                ${country.hasFullAccess ? '<span class="tag tag-purple">Full access</span>' : ''}
                                            </div>
                                        </td>
                                        <td>
                                            <div class="network-indicator">
                                                <span class="indicator-dot ${country.availableNetworks > 0 ? 'green' : 'gray'}"></span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="network-indicator">
                                                <span class="indicator-dot ${country.enabledNetworks > 0 ? 'green' : 'red'}"></span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="network-indicator">
                                                <span class="indicator-dot ${country.directNetworks > 0 ? 'green' : 'red'}"></span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="network-indicator">
                                                <span class="indicator-dot ${country.directRatTypes > 0 ? 'green' : 'red'}"></span>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="table-pagination">
                        <span class="pagination-info">1-10 out of 253</span>
                        <div class="pagination-controls">
                            <button class="pagination-btn" disabled>&lt;</button>
                            <span class="pagination-page active">1</span>
                            <span class="pagination-page">2</span>
                            <span class="pagination-page">3</span>
                            <span class="pagination-page">4</span>
                            <span class="pagination-page">5</span>
                            <span>...</span>
                            <span class="pagination-page">26</span>
                            <button class="pagination-btn">&gt;</button>
                            <span style="margin-left: 16px;">Country per page</span>
                            <select class="pagination-select">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getFlagEmoji(countryCode) {
        const flags = {
            'eu': '🇪🇺', 'us': '🇺🇸', 'fr': '🇫🇷', 'it': '🇮🇹', 'es': '🇪🇸', 'pt': '🇵🇹',
            'ca': '🇨🇦', 'br': '🇧🇷', 'mx': '🇲🇽', 'au': '🇦🇺', 'nz': '🇳🇿', 'jp': '🇯🇵',
            'kr': '🇰🇷', 'cn': '🇨🇳', 'hk': '🇭🇰', 'in': '🇮🇳', 'pk': '🇵🇰', 'za': '🇿🇦',
            'ng': '🇳🇬', 'ae': '🇦🇪', 'sa': '🇸🇦'
        };
        return flags[countryCode] || '🏳️';
    }

    renderWorldMapSVG() {
        // More detailed world map with Europe highlighted
        return `
            <defs>
                <pattern id="dots" patternUnits="userSpaceOnUse" width="8" height="8">
                    <circle cx="2" cy="2" r="1" fill="#E5E7EB"/>
                </pattern>
            </defs>
            <rect width="800" height="400" fill="#F9FAFB"/>
            <g stroke="none">
                <!-- North America -->
                <path d="M50,80 Q80,50 150,60 Q200,40 240,70 Q260,50 280,80 L300,100 Q320,90 340,120 L330,160 Q310,180 280,200 L260,220 Q240,240 200,230 L160,200 Q140,180 120,160 L100,140 Q70,130 60,100 Z" fill="#E5E7EB"/>
                <!-- Greenland -->
                <path d="M280,30 Q320,20 350,40 Q360,60 340,80 L310,70 Q290,50 280,30 Z" fill="#E5E7EB"/>
                <!-- South America -->
                <path d="M180,250 Q200,240 230,250 L250,270 Q270,300 260,340 L240,370 Q220,390 190,380 L170,350 Q150,310 160,280 L180,250 Z" fill="#E5E7EB"/>
                <!-- Europe (highlighted) -->
                <path d="M380,70 Q400,60 430,65 Q450,55 470,70 L480,90 Q490,80 500,95 L495,120 Q500,140 480,150 L450,155 Q430,165 400,155 L380,140 Q360,130 365,110 L380,70 Z" fill="#5B21B6" opacity="0.85"/>
                <!-- UK/Ireland -->
                <path d="M355,85 Q365,80 375,90 L370,105 Q360,110 355,100 Z" fill="#5B21B6" opacity="0.85"/>
                <!-- Scandinavia -->
                <path d="M420,40 Q440,30 450,50 L455,70 Q445,80 430,70 L420,40 Z" fill="#5B21B6" opacity="0.85"/>
                <!-- Africa -->
                <path d="M390,175 Q420,165 460,175 L490,200 Q510,240 500,290 L480,330 Q450,360 410,350 L380,320 Q360,280 370,240 L390,175 Z" fill="#E5E7EB"/>
                <!-- Middle East -->
                <path d="M500,150 Q530,140 560,155 L570,180 Q560,200 530,195 L500,175 Z" fill="#E5E7EB"/>
                <!-- Russia/Asia -->
                <path d="M510,60 Q560,40 620,50 Q680,45 720,70 L750,100 Q770,80 780,120 L775,160 Q760,180 720,170 L680,180 Q640,200 600,190 L560,170 Q530,150 520,120 L510,60 Z" fill="#E5E7EB"/>
                <!-- India -->
                <path d="M580,200 Q610,190 630,210 L620,260 Q600,280 580,260 L580,200 Z" fill="#E5E7EB"/>
                <!-- Southeast Asia -->
                <path d="M650,220 Q680,210 700,230 L710,260 Q690,280 660,270 L650,220 Z" fill="#E5E7EB"/>
                <!-- China/East Asia -->
                <path d="M640,140 Q680,130 720,150 L730,180 Q710,200 670,190 L640,170 Z" fill="#E5E7EB"/>
                <!-- Japan -->
                <path d="M750,140 Q765,130 770,150 L765,170 Q755,175 750,160 Z" fill="#E5E7EB"/>
                <!-- Australia -->
                <path d="M660,300 Q700,285 740,300 L760,330 Q750,370 710,375 L670,360 Q650,340 660,300 Z" fill="#E5E7EB"/>
                <!-- New Zealand -->
                <path d="M780,360 Q790,355 795,370 L790,385 Q780,388 780,370 Z" fill="#E5E7EB"/>
                <!-- Indonesia -->
                <path d="M680,280 Q710,275 730,285 L725,295 Q700,300 680,290 Z" fill="#E5E7EB"/>
            </g>
        `;
    }

    // ===============================================
    // IP ADDRESS SPACES
    // ===============================================
    renderIPAddressSpaces() {
        const container = document.getElementById('ip-management');
        
        container.innerHTML = `
            <div class="table-header-row">
                <div></div>
                <button class="btn btn-primary">Add new IP Address Space</button>
            </div>
            
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>IP Address Space</th>
                            <th>Allocated IPs</th>
                            <th>Available IPs</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.data.ipAddressSpaces.map(space => `
                            <tr>
                                <td class="cell-id">${space.id}</td>
                                <td class="cell-name" style="font-family: 'SF Mono', Monaco, monospace;">${space.ipAddressSpace}</td>
                                <td class="cell-count">${space.allocatedIPs}</td>
                                <td class="cell-count">${space.availableIPs}</td>
                                <td>
                                    <a href="#" class="status-link">Assigned to devices</a>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DevicePoliciesApp();
});

