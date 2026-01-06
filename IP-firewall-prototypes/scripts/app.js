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
        this.renderNetworkProfiles();
        this.renderIPAddressSpaces();
        
        // Initialize accordion
        window.accordion = new Accordion();
        
        // Initialize toggle switches
        ToggleSwitch.init();
        
        // Initialize modal handlers
        this.initModalHandlers();
    }

    initModalHandlers() {
        // Close modal on overlay click
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.addEventListener('click', (e) => {
                if (e.target === modalContainer) {
                    this.closeModal();
                }
            });
        }
        
        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    openModal(content) {
        const modalContainer = document.getElementById('modal-container');
        const modalContent = modalContainer.querySelector('.modal-content');
        modalContent.innerHTML = content;
        modalContainer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.classList.add('hidden');
        document.body.style.overflow = '';
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'success' 
                    ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
                    : type === 'error'
                    ? '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
                    : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
                }
            </svg>
            <span>${message}</span>
        `;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('toast-fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
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
                    
                    <!-- IP Firewall Section -->
                    ${this.renderIPFirewallSection(policy)}
                </div>
            </div>
        `;
    }

    renderIPFirewallSection(policy) {
        const d = policy.details;
        const firewallEnabled = d.ipFirewall?.enabled ?? false;
        const ruleSets = d.ipFirewall?.ruleSets ?? [];

        return `
            <div class="ip-firewall-section">
                <div class="section-header-row">
                    <div class="section-header-title">
                        <svg class="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        <h4>IP Firewall</h4>
                        <span class="feature-badge ${firewallEnabled ? 'badge-enabled' : 'badge-disabled'}">
                            ${firewallEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" ${firewallEnabled ? 'checked' : ''} onchange="window.app.toggleFirewall('${policy.id}', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                ${firewallEnabled ? `
                    <div class="firewall-content">
                        <p class="section-description">
                            Control outbound IP traffic by attaching Network Profiles. Rules are evaluated by priority (lowest number first).
                        </p>
                        
                        ${ruleSets.length > 0 ? `
                            <div class="rule-sets-table">
                                <div class="table-container">
                                    <table class="data-table">
                                        <thead>
                                            <tr>
                                                <th>Priority</th>
                                                <th>Network Profile</th>
                                                <th>Type</th>
                                                <th>Rules</th>
                                                <th>Added</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${ruleSets.sort((a, b) => a.priority - b.priority).map(ruleSet => {
                                                const profile = this.data.networkProfiles.find(p => p.id === ruleSet.networkProfileId);
                                                const profileType = profile ? profile.type : 'IP';
                                                const rulesCount = profile ? profile.rulesCount : 0;
                                                return `
                                                <tr class="rule-set-row" data-ruleset-id="${ruleSet.id}">
                                                    <td>
                                                        <div class="priority-badge">${ruleSet.priority}</div>
                                                    </td>
                                                    <td>
                                                        <div class="profile-link">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                                            </svg>
                                                            <a href="#" onclick="event.preventDefault(); window.app.scrollToProfile('${ruleSet.networkProfileId}')">${ruleSet.networkProfileName}</a>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span class="type-badge type-badge-${profileType.toLowerCase()}">${profileType}</span>
                                                    </td>
                                                    <td class="cell-count">${rulesCount} rules</td>
                                                    <td class="cell-muted">${new Date(ruleSet.added).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                    <td>
                                                        <div class="row-actions row-actions-visible">
                                                            <button class="icon-btn" title="Change Priority" onclick="window.app.changePriority('${policy.id}', '${ruleSet.id}')">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                                    <polyline points="17 11 12 6 7 11"></polyline>
                                                                    <polyline points="17 18 12 13 7 18"></polyline>
                                                                </svg>
                                                            </button>
                                                            <button class="icon-btn icon-btn-danger" title="Remove" onclick="window.app.removeRuleSet('${policy.id}', '${ruleSet.id}')">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            `}).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ` : `
                            <div class="empty-state-inline">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                                <p>No firewall rules attached yet.</p>
                            </div>
                        `}
                        
                        <button class="btn btn-outline btn-sm" onclick="window.app.openAddRuleSetModal('${policy.id}')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add rule set
                        </button>
                    </div>
                ` : `
                    <div class="firewall-disabled-message">
                        <p>Enable IP Firewall to control which IP destinations devices can communicate with.</p>
                    </div>
                `}
            </div>
        `;
    }

    // IP Firewall Actions
    toggleFirewall(policyId, enabled) {
        const policy = this.data.servicePolicies.find(p => p.id === policyId);
        if (policy) {
            if (!policy.details.ipFirewall) {
                policy.details.ipFirewall = { enabled: false, ruleSets: [] };
            }
            policy.details.ipFirewall.enabled = enabled;
            this.renderServicePolicies();
            this.showToast(`IP Firewall ${enabled ? 'enabled' : 'disabled'}`, 'success');
            
            // Re-expand the row
            setTimeout(() => {
                const row = document.querySelector(`[data-policy-id="${policyId}"]`);
                if (row) {
                    DetailsPanel.toggleRow(row, policyId, 'service');
                }
            }, 100);
        }
    }

    openAddRuleSetModal(policyId) {
        const availableProfiles = this.data.networkProfiles.filter(p => p.type === 'IP');
        const policy = this.data.servicePolicies.find(p => p.id === policyId);
        const existingProfileIds = policy?.details?.ipFirewall?.ruleSets?.map(rs => rs.networkProfileId) || [];
        const unattachedProfiles = availableProfiles.filter(p => !existingProfileIds.includes(p.id));

        const modalContent = `
            <div class="modal-dialog">
                <div class="modal-header">
                    <h2>Add Firewall Rule Set</h2>
                    <button class="modal-close" onclick="window.app.closeModal()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    ${unattachedProfiles.length > 0 ? `
                        <div class="form-group">
                            <label class="form-label">Select Network Profile</label>
                            <select class="form-select" id="select-profile">
                                <option value="">Choose a profile...</option>
                                ${unattachedProfiles.map(p => `
                                    <option value="${p.id}">${p.name} (${p.rulesCount} rules)</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Priority</label>
                            <input type="number" class="form-input" id="ruleset-priority" value="1" min="1" max="100">
                            <div class="form-hint">Lower numbers are evaluated first (1 = highest priority)</div>
                        </div>
                    ` : `
                        <div class="empty-state">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <p>All available Network Profiles are already attached to this Service Policy.</p>
                            <button class="btn btn-outline" onclick="window.app.closeModal(); window.app.openCreateProfileModal();">
                                Create New Profile
                            </button>
                        </div>
                    `}
                </div>
                ${unattachedProfiles.length > 0 ? `
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
                        <button class="btn btn-primary" onclick="window.app.addRuleSet('${policyId}')">Add Rule Set</button>
                    </div>
                ` : `
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="window.app.closeModal()">Close</button>
                    </div>
                `}
            </div>
        `;
        this.openModal(modalContent);
    }

    addRuleSet(policyId) {
        const profileId = document.getElementById('select-profile').value;
        const priority = parseInt(document.getElementById('ruleset-priority').value, 10) || 1;

        if (!profileId) {
            this.showToast('Please select a Network Profile', 'error');
            return;
        }

        const policy = this.data.servicePolicies.find(p => p.id === policyId);
        const profile = this.data.networkProfiles.find(p => p.id === profileId);

        if (!policy || !profile) return;

        if (!policy.details.ipFirewall) {
            policy.details.ipFirewall = { enabled: true, ruleSets: [] };
        }

        const newRuleSet = {
            id: 'fwrs-' + Date.now(),
            priority: priority,
            networkProfileId: profileId,
            networkProfileName: profile.name,
            added: new Date().toISOString()
        };

        policy.details.ipFirewall.ruleSets.push(newRuleSet);
        
        // Update the profile's attached policies
        if (!profile.attachedPolicies.includes(policyId)) {
            profile.attachedPolicies.push(policyId);
        }

        this.renderServicePolicies();
        this.renderNetworkProfiles();
        this.closeModal();
        this.showToast('Rule set added successfully', 'success');

        // Re-expand the row
        setTimeout(() => {
            const row = document.querySelector(`[data-policy-id="${policyId}"]`);
            if (row) {
                DetailsPanel.toggleRow(row, policyId, 'service');
            }
        }, 100);
    }

    removeRuleSet(policyId, ruleSetId) {
        const policy = this.data.servicePolicies.find(p => p.id === policyId);
        if (!policy || !policy.details.ipFirewall) return;

        const ruleSet = policy.details.ipFirewall.ruleSets.find(rs => rs.id === ruleSetId);
        if (!ruleSet) return;

        // Remove from policy
        policy.details.ipFirewall.ruleSets = policy.details.ipFirewall.ruleSets.filter(rs => rs.id !== ruleSetId);

        // Update the profile's attached policies
        const profile = this.data.networkProfiles.find(p => p.id === ruleSet.networkProfileId);
        if (profile) {
            profile.attachedPolicies = profile.attachedPolicies.filter(id => id !== policyId);
        }

        this.renderServicePolicies();
        this.renderNetworkProfiles();
        this.showToast('Rule set removed', 'success');

        // Re-expand the row
        setTimeout(() => {
            const row = document.querySelector(`[data-policy-id="${policyId}"]`);
            if (row) {
                DetailsPanel.toggleRow(row, policyId, 'service');
            }
        }, 100);
    }

    changePriority(policyId, ruleSetId) {
        const policy = this.data.servicePolicies.find(p => p.id === policyId);
        if (!policy || !policy.details.ipFirewall) return;

        const ruleSet = policy.details.ipFirewall.ruleSets.find(rs => rs.id === ruleSetId);
        if (!ruleSet) return;

        const modalContent = `
            <div class="modal-dialog modal-sm">
                <div class="modal-header">
                    <h2>Change Priority</h2>
                    <button class="modal-close" onclick="window.app.closeModal()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Priority for "${ruleSet.networkProfileName}"</label>
                        <input type="number" class="form-input" id="new-priority" value="${ruleSet.priority}" min="1" max="100">
                        <div class="form-hint">Lower numbers are evaluated first (1 = highest priority)</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="window.app.savePriority('${policyId}', '${ruleSetId}')">Save</button>
                </div>
            </div>
        `;
        this.openModal(modalContent);
    }

    savePriority(policyId, ruleSetId) {
        const newPriority = parseInt(document.getElementById('new-priority').value, 10);
        
        if (isNaN(newPriority) || newPriority < 1) {
            this.showToast('Invalid priority value', 'error');
            return;
        }

        const policy = this.data.servicePolicies.find(p => p.id === policyId);
        if (!policy || !policy.details.ipFirewall) return;

        const ruleSet = policy.details.ipFirewall.ruleSets.find(rs => rs.id === ruleSetId);
        if (ruleSet) {
            ruleSet.priority = newPriority;
        }

        this.renderServicePolicies();
        this.closeModal();
        this.showToast('Priority updated', 'success');

        // Re-expand the row
        setTimeout(() => {
            const row = document.querySelector(`[data-policy-id="${policyId}"]`);
            if (row) {
                DetailsPanel.toggleRow(row, policyId, 'service');
            }
        }, 100);
    }

    scrollToProfile(profileId) {
        // Open Network Profiles section and scroll to the profile
        const section = document.getElementById('network-profiles-section');
        if (section && !section.classList.contains('open')) {
            window.accordion.open(section);
        }

        setTimeout(() => {
            const row = document.querySelector(`[data-profile-id="${profileId}"]`);
            if (row) {
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                row.classList.add('highlight-row');
                setTimeout(() => row.classList.remove('highlight-row'), 2000);
            }
        }, 300);
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

    // ===============================================
    // NETWORK PROFILES (IP FIREWALL)
    // ===============================================
    renderNetworkProfiles() {
        const container = document.getElementById('network-profiles');
        
        container.innerHTML = `
            <p class="table-description">
                Network Profiles allow you to define IP-based firewall rules that control which destinations your devices can communicate with. 
                Create profiles with allow/deny rules and attach them to Service Policies to enforce outbound traffic restrictions.
            </p>
            
            <div class="table-header-row">
                <div class="table-filter-row">
                    <div class="filter-group">
                        <label class="filter-label">Type</label>
                        <select class="form-select form-select-sm">
                            <option value="all">All Types</option>
                            <option value="IP">IP Firewall</option>
                            <option value="DNS">DNS Firewall</option>
                        </select>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="window.app.openCreateProfileModal()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    New network profile
                </button>
            </div>
            
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Rules</th>
                            <th>Attached Policies</th>
                            <th>Modified</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.data.networkProfiles.map(profile => this.renderNetworkProfileRow(profile)).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Add click handlers for rows
        container.querySelectorAll('.profile-row').forEach(row => {
            row.addEventListener('click', (e) => {
                if (!e.target.closest('button') && !e.target.closest('.actions-menu')) {
                    const profileId = row.dataset.profileId;
                    DetailsPanel.toggleRow(row, profileId, 'network-profile');
                }
            });
        });
    }

    renderNetworkProfileRow(profile) {
        const attachedCount = profile.attachedPolicies.length;
        const modifiedDate = new Date(profile.modified).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });

        return `
            <tr class="profile-row clickable" data-profile-id="${profile.id}">
                <td class="cell-id">${profile.id}</td>
                <td class="cell-name">
                    <div class="profile-name-cell">
                        <svg class="profile-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        <span>${profile.name}</span>
                    </div>
                </td>
                <td>
                    <span class="type-badge type-badge-${profile.type.toLowerCase()}">${profile.type}</span>
                </td>
                <td class="cell-count">${profile.rulesCount} rules</td>
                <td class="cell-count">
                    ${attachedCount > 0 
                        ? `<a href="#" class="link-with-icon">${attachedCount} ${attachedCount === 1 ? 'policy' : 'policies'}</a>` 
                        : '<span class="text-muted">Not attached</span>'}
                </td>
                <td class="cell-muted">${modifiedDate}</td>
                <td>
                    <div class="row-actions">
                        <button class="icon-btn" title="Edit" onclick="event.stopPropagation(); window.app.openEditProfileModal('${profile.id}')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="icon-btn" title="Duplicate" onclick="event.stopPropagation(); window.app.duplicateProfile('${profile.id}')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                        <button class="icon-btn icon-btn-danger" title="Delete" onclick="event.stopPropagation(); window.app.deleteProfile('${profile.id}')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
            <tr class="detail-row hidden" id="network-profile-detail-row-${profile.id}">
                <td colspan="7">
                    ${this.renderNetworkProfileDetail(profile)}
                </td>
            </tr>
        `;
    }

    renderNetworkProfileDetail(profile) {
        const attachedPolicies = profile.attachedPolicies.map(policyId => {
            const policy = this.data.servicePolicies.find(p => p.id === policyId);
            return policy ? policy.name : policyId;
        });

        return `
            <div class="detail-panel network-profile-detail">
                <div class="detail-panel-header">
                    <div class="detail-panel-title">
                        <div class="profile-title-group">
                            <svg class="profile-icon-large" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <div>
                                <h3>${profile.name}</h3>
                                <p class="profile-description">${profile.description}</p>
                            </div>
                        </div>
                    </div>
                    <div class="detail-panel-actions">
                        <button class="btn btn-outline btn-sm" onclick="window.app.openEditProfileModal('${profile.id}')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                        </button>
                    </div>
                </div>
                
                <div class="detail-panel-body">
                    <div class="profile-detail-grid">
                        <!-- Left Column: Rules Editor -->
                        <div class="rules-section">
                            <div class="rules-header">
                                <h4>Firewall Rules</h4>
                                <div class="rules-actions">
                                    <button class="btn btn-outline btn-sm" onclick="window.app.validateRules('${profile.id}')">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        Validate
                                    </button>
                                </div>
                            </div>
                            <div class="code-editor-container" id="editor-${profile.id}">
                                <div class="code-editor-wrapper">
                                    <div class="line-numbers" id="line-numbers-${profile.id}"></div>
                                    <textarea 
                                        class="code-editor" 
                                        id="rules-editor-${profile.id}"
                                        spellcheck="false"
                                        data-profile-id="${profile.id}"
                                    >${profile.rules}</textarea>
                                    <pre class="code-highlight" id="highlight-${profile.id}"></pre>
                                </div>
                                <div class="validation-status" id="validation-status-${profile.id}">
                                    <span class="status-idle">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                        Click "Validate" to check syntax
                                    </span>
                                </div>
                            </div>
                            <div class="rules-legend">
                                <div class="legend-title">Syntax Reference:</div>
                                <div class="legend-items">
                                    <code>ACTION ADDRESS DIRECTION PROTOCOL [PORTS] [#comment]</code>
                                    <div class="legend-examples">
                                        <span><strong>ACTION:</strong> ALLOW | DENY</span>
                                        <span><strong>ADDRESS:</strong> ip:x.x.x.x | cidr:x.x.x.x/xx | any</span>
                                        <span><strong>DIRECTION:</strong> IN | OUT</span>
                                        <span><strong>PROTOCOL:</strong> tcp | udp | icmp | any</span>
                                        <span><strong>PORTS:</strong> port:443 | port:80,443 | port:8000-9000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Right Column: Meta Information -->
                        <div class="profile-meta-section">
                            <div class="meta-card">
                                <h4>Profile Information</h4>
                                <div class="meta-row">
                                    <span class="meta-label">Profile ID</span>
                                    <span class="meta-value mono">${profile.id}</span>
                                </div>
                                <div class="meta-row">
                                    <span class="meta-label">Type</span>
                                    <span class="type-badge type-badge-${profile.type.toLowerCase()}">${profile.type} Firewall</span>
                                </div>
                                <div class="meta-row">
                                    <span class="meta-label">Created</span>
                                    <span class="meta-value">${new Date(profile.created).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div class="meta-row">
                                    <span class="meta-label">Last Modified</span>
                                    <span class="meta-value">${new Date(profile.modified).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            </div>
                            
                            <div class="meta-card">
                                <h4>Attached Service Policies</h4>
                                ${attachedPolicies.length > 0 ? `
                                    <div class="attached-policies-list">
                                        ${attachedPolicies.map(name => `
                                            <div class="attached-policy-item">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                                    <path d="M9 9h6v6H9z"></path>
                                                </svg>
                                                <span>${name}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : `
                                    <div class="empty-state-small">
                                        <p>This profile is not attached to any service policy yet.</p>
                                        <button class="btn btn-link btn-sm">Attach to policy</button>
                                    </div>
                                `}
                            </div>
                            
                            <div class="meta-card meta-card-warning">
                                <div class="warning-header">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                    <span>Important</span>
                                </div>
                                <p>Rules are evaluated top-to-bottom. First matching rule wins. Always end with a DENY any OUT any rule for security.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===============================================
    // NETWORK PROFILE ACTIONS
    // ===============================================
    openCreateProfileModal() {
        const modalContent = `
            <div class="modal-dialog modal-lg">
                <div class="modal-header">
                    <h2>Create Network Profile</h2>
                    <button class="modal-close" onclick="window.app.closeModal()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Profile Name *</label>
                        <input type="text" class="form-input" id="profile-name" placeholder="e.g., IoT Device Whitelist">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <input type="text" class="form-input" id="profile-description" placeholder="Brief description of this profile's purpose">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Profile Type</label>
                        <select class="form-select" id="profile-type">
                            <option value="IP" selected>IP Firewall</option>
                            <option value="DNS" disabled>DNS Firewall (Coming Soon)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Firewall Rules</label>
                        <div class="code-editor-container modal-editor">
                            <textarea 
                                class="code-editor" 
                                id="new-profile-rules"
                                spellcheck="false"
                                placeholder="# Enter firewall rules here
# Example:
ALLOW ip:8.8.8.8 OUT udp port:53
DENY any OUT any"
                            ></textarea>
                        </div>
                        <div class="form-hint">
                            Enter one rule per line. Format: ACTION ADDRESS DIRECTION PROTOCOL [PORTS]
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
                    <button class="btn btn-outline" onclick="window.app.validateNewProfile()">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Validate
                    </button>
                    <button class="btn btn-primary" onclick="window.app.createProfile()">Create Profile</button>
                </div>
            </div>
        `;
        this.openModal(modalContent);
    }

    openEditProfileModal(profileId) {
        const profile = this.data.networkProfiles.find(p => p.id === profileId);
        if (!profile) return;

        const modalContent = `
            <div class="modal-dialog modal-lg">
                <div class="modal-header">
                    <h2>Edit Network Profile</h2>
                    <button class="modal-close" onclick="window.app.closeModal()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Profile Name *</label>
                        <input type="text" class="form-input" id="edit-profile-name" value="${profile.name}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <input type="text" class="form-input" id="edit-profile-description" value="${profile.description}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Profile Type</label>
                        <select class="form-select" id="edit-profile-type" disabled>
                            <option value="IP" ${profile.type === 'IP' ? 'selected' : ''}>IP Firewall</option>
                            <option value="DNS" ${profile.type === 'DNS' ? 'selected' : ''}>DNS Firewall</option>
                        </select>
                        <div class="form-hint">Profile type cannot be changed after creation.</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Firewall Rules</label>
                        <div class="code-editor-container modal-editor">
                            <textarea 
                                class="code-editor" 
                                id="edit-profile-rules"
                                spellcheck="false"
                            >${profile.rules}</textarea>
                        </div>
                        <div id="edit-validation-result"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
                    <button class="btn btn-outline" onclick="window.app.validateEditProfile()">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Validate
                    </button>
                    <button class="btn btn-primary" onclick="window.app.saveProfile('${profile.id}')">Save Changes</button>
                </div>
            </div>
        `;
        this.openModal(modalContent);
    }

    createProfile() {
        const name = document.getElementById('profile-name').value.trim();
        const description = document.getElementById('profile-description').value.trim();
        const type = document.getElementById('profile-type').value;
        const rules = document.getElementById('new-profile-rules').value;

        if (!name) {
            this.showToast('Profile name is required', 'error');
            return;
        }

        // Validate rules
        const validation = FirewallRuleValidator.validate(rules);
        if (!validation.valid) {
            this.showToast('Please fix rule syntax errors before saving', 'error');
            return;
        }

        // Create new profile (mock)
        const newProfile = {
            id: 'np-' + Date.now(),
            name: name,
            type: type,
            description: description || 'No description',
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            rulesCount: rules.split('\n').filter(line => line.trim() && !line.trim().startsWith('#')).length,
            attachedPolicies: [],
            rules: rules
        };

        this.data.networkProfiles.push(newProfile);
        this.renderNetworkProfiles();
        this.closeModal();
        this.showToast('Network profile created successfully', 'success');
        
        // Refresh accordion
        const section = document.getElementById('network-profiles-section');
        if (section && window.accordion) {
            setTimeout(() => window.accordion.refresh(section), 100);
        }
    }

    saveProfile(profileId) {
        const profile = this.data.networkProfiles.find(p => p.id === profileId);
        if (!profile) return;

        const name = document.getElementById('edit-profile-name').value.trim();
        const description = document.getElementById('edit-profile-description').value.trim();
        const rules = document.getElementById('edit-profile-rules').value;

        if (!name) {
            this.showToast('Profile name is required', 'error');
            return;
        }

        // Validate rules
        const validation = FirewallRuleValidator.validate(rules);
        if (!validation.valid) {
            this.showToast('Please fix rule syntax errors before saving', 'error');
            return;
        }

        // Update profile
        profile.name = name;
        profile.description = description;
        profile.rules = rules;
        profile.rulesCount = rules.split('\n').filter(line => line.trim() && !line.trim().startsWith('#')).length;
        profile.modified = new Date().toISOString();

        this.renderNetworkProfiles();
        this.closeModal();
        this.showToast('Network profile updated successfully', 'success');
    }

    duplicateProfile(profileId) {
        const profile = this.data.networkProfiles.find(p => p.id === profileId);
        if (!profile) return;

        const newProfile = {
            ...profile,
            id: 'np-' + Date.now(),
            name: profile.name + ' (Copy)',
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            attachedPolicies: []
        };

        this.data.networkProfiles.push(newProfile);
        this.renderNetworkProfiles();
        this.showToast('Network profile duplicated', 'success');
        
        const section = document.getElementById('network-profiles-section');
        if (section && window.accordion) {
            setTimeout(() => window.accordion.refresh(section), 100);
        }
    }

    deleteProfile(profileId) {
        const profile = this.data.networkProfiles.find(p => p.id === profileId);
        if (!profile) return;

        if (profile.attachedPolicies.length > 0) {
            this.showToast('Cannot delete profile that is attached to service policies', 'error');
            return;
        }

        const modalContent = `
            <div class="modal-dialog modal-sm">
                <div class="modal-header">
                    <h2>Delete Network Profile</h2>
                    <button class="modal-close" onclick="window.app.closeModal()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="delete-warning">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <p>Are you sure you want to delete <strong>${profile.name}</strong>?</p>
                        <p class="text-muted">This action cannot be undone.</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="window.app.closeModal()">Cancel</button>
                    <button class="btn btn-danger" onclick="window.app.confirmDeleteProfile('${profileId}')">Delete Profile</button>
                </div>
            </div>
        `;
        this.openModal(modalContent);
    }

    confirmDeleteProfile(profileId) {
        const index = this.data.networkProfiles.findIndex(p => p.id === profileId);
        if (index > -1) {
            this.data.networkProfiles.splice(index, 1);
            this.renderNetworkProfiles();
            this.closeModal();
            this.showToast('Network profile deleted', 'success');
        }
    }

    validateRules(profileId) {
        const textarea = document.getElementById(`rules-editor-${profileId}`);
        const statusEl = document.getElementById(`validation-status-${profileId}`);
        
        if (!textarea || !statusEl) return;

        const rules = textarea.value;
        const validation = FirewallRuleValidator.validate(rules);

        if (validation.valid) {
            statusEl.innerHTML = `
                <span class="status-success">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Valid! ${validation.ruleCount} rules parsed successfully.
                </span>
            `;
            this.showToast('Rules validated successfully', 'success');
        } else {
            statusEl.innerHTML = `
                <span class="status-error">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    ${validation.errors.length} error(s) found
                </span>
                <div class="validation-errors">
                    ${validation.errors.map(err => `
                        <div class="validation-error-item">
                            <span class="error-line">Line ${err.line}:</span>
                            <span class="error-message">${err.message}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            this.showToast('Validation failed - check errors', 'error');
        }
    }

    validateNewProfile() {
        const rules = document.getElementById('new-profile-rules').value;
        const validation = FirewallRuleValidator.validate(rules);

        if (validation.valid) {
            this.showToast(`Valid! ${validation.ruleCount} rules parsed successfully.`, 'success');
        } else {
            this.showToast(`${validation.errors.length} error(s) found. Check your rules.`, 'error');
        }
    }

    validateEditProfile() {
        const rules = document.getElementById('edit-profile-rules').value;
        const resultEl = document.getElementById('edit-validation-result');
        const validation = FirewallRuleValidator.validate(rules);

        if (validation.valid) {
            resultEl.innerHTML = `
                <div class="validation-success">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Valid! ${validation.ruleCount} rules parsed successfully.
                </div>
            `;
        } else {
            resultEl.innerHTML = `
                <div class="validation-error">
                    <div class="error-header">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        ${validation.errors.length} error(s) found:
                    </div>
                    ${validation.errors.map(err => `
                        <div class="error-item">Line ${err.line}: ${err.message}</div>
                    `).join('')}
                </div>
            `;
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DevicePoliciesApp();
});

