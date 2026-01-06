// ===============================================
// ACCORDION FUNCTIONALITY
// ===============================================

class Accordion {
    constructor() {
        this.sections = document.querySelectorAll('.accordion-section');
        this.init();
    }

    init() {
        this.sections.forEach(section => {
            const header = section.querySelector('.accordion-header');
            header.addEventListener('click', () => this.toggle(section));
        });

        // Open first section by default
        if (this.sections.length > 0) {
            this.open(this.sections[0]);
            this.open(this.sections[1]); // Also open coverage policies
        }
    }

    toggle(section) {
        if (section.classList.contains('open')) {
            this.close(section);
        } else {
            this.open(section);
        }
    }

    open(section) {
        section.classList.add('open');
        const content = section.querySelector('.accordion-content');
        content.style.maxHeight = content.scrollHeight + 1000 + 'px';
    }

    close(section) {
        section.classList.remove('open');
        const content = section.querySelector('.accordion-content');
        content.style.maxHeight = '0';
    }

    refresh(section) {
        if (section.classList.contains('open')) {
            const content = section.querySelector('.accordion-content');
            content.style.maxHeight = content.scrollHeight + 1000 + 'px';
        }
    }
}

// Toggle switch functionality
class ToggleSwitch {
    static init() {
        document.addEventListener('click', (e) => {
            const toggle = e.target.closest('.toggle-switch');
            if (toggle) {
                const input = toggle.querySelector('input');
                if (input && e.target !== input) {
                    input.checked = !input.checked;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        });
    }
}

// Details panel toggle
class DetailsPanel {
    static togglePolicy(policyId, type) {
        const panel = document.getElementById(`${type}-detail-${policyId}`);
        const btn = document.querySelector(`[data-policy-id="${policyId}"][data-type="${type}"]`);
        
        if (panel) {
            panel.classList.toggle('hidden');
            if (btn) {
                btn.classList.toggle('open');
            }
            
            // Refresh accordion height
            const section = panel.closest('.accordion-section');
            if (section && window.accordion) {
                window.accordion.refresh(section);
            }
        }
    }

    static toggleRow(rowElement, policyId, type) {
        const detailRow = document.getElementById(`${type}-detail-row-${policyId}`);
        
        if (detailRow) {
            const isHidden = detailRow.classList.contains('hidden');
            
            // Close all other detail rows first
            document.querySelectorAll('.detail-row').forEach(row => {
                row.classList.add('hidden');
            });
            document.querySelectorAll('.data-table tbody tr').forEach(row => {
                row.classList.remove('active');
            });
            
            if (isHidden) {
                detailRow.classList.remove('hidden');
                rowElement.classList.add('active');
            }
            
            // Refresh accordion height
            const section = detailRow.closest('.accordion-section');
            if (section && window.accordion) {
                setTimeout(() => window.accordion.refresh(section), 50);
            }
        }
    }
}

// ===============================================
// FIREWALL RULE VALIDATOR
// ===============================================

class FirewallRuleValidator {
    static ACTIONS = ['ALLOW', 'DENY'];
    static DIRECTIONS = ['IN', 'OUT'];
    static PROTOCOLS = ['TCP', 'UDP', 'ICMP', 'ANY'];

    static validate(rulesText) {
        const lines = rulesText.split('\n');
        const errors = [];
        let ruleCount = 0;

        lines.forEach((line, index) => {
            const lineNum = index + 1;
            const trimmedLine = line.trim();

            // Skip empty lines and comments
            if (!trimmedLine || trimmedLine.startsWith('#')) {
                return;
            }

            // Remove inline comment
            const rulePart = trimmedLine.split('#')[0].trim();
            if (!rulePart) return;

            const parseResult = this.parseRule(rulePart, lineNum);
            if (parseResult.error) {
                errors.push(parseResult.error);
            } else {
                ruleCount++;
            }
        });

        return {
            valid: errors.length === 0,
            errors: errors,
            ruleCount: ruleCount
        };
    }

    static parseRule(rule, lineNum) {
        const parts = rule.split(/\s+/).filter(p => p);
        
        if (parts.length < 4) {
            return {
                error: {
                    line: lineNum,
                    message: 'Incomplete rule. Expected: ACTION ADDRESS DIRECTION PROTOCOL [PORTS]'
                }
            };
        }

        // Parse ACTION
        const action = parts[0].toUpperCase();
        if (!this.ACTIONS.includes(action)) {
            return {
                error: {
                    line: lineNum,
                    message: `Invalid action "${parts[0]}". Must be ALLOW or DENY.`
                }
            };
        }

        // Parse ADDRESSES (can be multiple)
        let i = 1;
        const addresses = [];
        while (i < parts.length && this.isAddress(parts[i])) {
            const addrValidation = this.validateAddress(parts[i]);
            if (!addrValidation.valid) {
                return {
                    error: {
                        line: lineNum,
                        message: addrValidation.message
                    }
                };
            }
            addresses.push(parts[i]);
            i++;
        }

        if (addresses.length === 0) {
            return {
                error: {
                    line: lineNum,
                    message: 'No address specified. Use ip:x.x.x.x, cidr:x.x.x.x/xx, or any.'
                }
            };
        }

        // Parse DIRECTION
        if (i >= parts.length) {
            return {
                error: {
                    line: lineNum,
                    message: 'Missing direction. Must specify IN or OUT.'
                }
            };
        }

        const direction = parts[i].toUpperCase();
        if (!this.DIRECTIONS.includes(direction)) {
            return {
                error: {
                    line: lineNum,
                    message: `Invalid direction "${parts[i]}". Must be IN or OUT.`
                }
            };
        }
        i++;

        // Parse PROTOCOL
        if (i >= parts.length) {
            return {
                error: {
                    line: lineNum,
                    message: 'Missing protocol. Must specify tcp, udp, icmp, or any.'
                }
            };
        }

        const protocol = parts[i].toUpperCase();
        if (!this.PROTOCOLS.includes(protocol)) {
            return {
                error: {
                    line: lineNum,
                    message: `Invalid protocol "${parts[i]}". Must be tcp, udp, icmp, or any.`
                }
            };
        }
        i++;

        // Parse optional PORTS
        if (i < parts.length) {
            const portPart = parts[i].toLowerCase();
            if (portPart.startsWith('port:') || portPart.startsWith('ports:')) {
                const portValidation = this.validatePorts(parts[i]);
                if (!portValidation.valid) {
                    return {
                        error: {
                            line: lineNum,
                            message: portValidation.message
                        }
                    };
                }

                // Ports only valid for TCP/UDP
                if (protocol !== 'TCP' && protocol !== 'UDP' && protocol !== 'ANY') {
                    return {
                        error: {
                            line: lineNum,
                            message: 'Ports can only be specified for TCP or UDP protocols.'
                        }
                    };
                }
            }
        }

        return { valid: true };
    }

    static isAddress(part) {
        const lower = part.toLowerCase();
        return lower === 'any' || 
               lower.startsWith('ip:') || 
               lower.startsWith('cidr:');
    }

    static validateAddress(addr) {
        const lower = addr.toLowerCase();
        
        if (lower === 'any') {
            return { valid: true };
        }

        if (lower.startsWith('ip:')) {
            const ip = addr.substring(3);
            if (!this.isValidIP(ip)) {
                return { valid: false, message: `Invalid IP address "${ip}".` };
            }
            return { valid: true };
        }

        if (lower.startsWith('cidr:')) {
            const cidr = addr.substring(5);
            if (!this.isValidCIDR(cidr)) {
                return { valid: false, message: `Invalid CIDR notation "${cidr}".` };
            }
            return { valid: true };
        }

        return { valid: false, message: `Invalid address format "${addr}". Use ip:, cidr:, or any.` };
    }

    static isValidIP(ip) {
        const parts = ip.split('.');
        if (parts.length !== 4) return false;
        return parts.every(part => {
            const num = parseInt(part, 10);
            return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
        });
    }

    static isValidCIDR(cidr) {
        const parts = cidr.split('/');
        if (parts.length !== 2) return false;
        if (!this.isValidIP(parts[0])) return false;
        const prefix = parseInt(parts[1], 10);
        return !isNaN(prefix) && prefix >= 0 && prefix <= 32;
    }

    static validatePorts(portStr) {
        const colonIndex = portStr.indexOf(':');
        if (colonIndex === -1) {
            return { valid: false, message: 'Invalid port format. Use port:443 or port:80,443.' };
        }

        const portSpec = portStr.substring(colonIndex + 1);
        const portParts = portSpec.split(',');

        for (const part of portParts) {
            if (part.includes('-')) {
                // Port range
                const range = part.split('-');
                if (range.length !== 2) {
                    return { valid: false, message: `Invalid port range "${part}".` };
                }
                const start = parseInt(range[0], 10);
                const end = parseInt(range[1], 10);
                if (isNaN(start) || isNaN(end) || start < 1 || end > 65535 || start > end) {
                    return { valid: false, message: `Invalid port range "${part}". Ports must be 1-65535.` };
                }
            } else {
                // Single port
                const port = parseInt(part, 10);
                if (isNaN(port) || port < 1 || port > 65535) {
                    return { valid: false, message: `Invalid port "${part}". Ports must be 1-65535.` };
                }
            }
        }

        return { valid: true };
    }

    static highlightSyntax(rulesText) {
        const lines = rulesText.split('\n');
        return lines.map(line => {
            const trimmed = line.trim();
            
            // Comment lines
            if (trimmed.startsWith('#')) {
                return `<span class="syntax-comment">${this.escapeHtml(line)}</span>`;
            }
            
            // Empty lines
            if (!trimmed) {
                return line;
            }

            // Split into rule and comment
            const commentIndex = line.indexOf('#');
            let rulePart = line;
            let commentPart = '';
            
            if (commentIndex > 0) {
                rulePart = line.substring(0, commentIndex);
                commentPart = line.substring(commentIndex);
            }

            // Highlight rule parts
            let highlighted = rulePart
                .replace(/\b(ALLOW|DENY)\b/gi, '<span class="syntax-action">$1</span>')
                .replace(/\b(IN|OUT)\b/gi, '<span class="syntax-direction">$1</span>')
                .replace(/\b(tcp|udp|icmp|any)\b/gi, '<span class="syntax-protocol">$1</span>')
                .replace(/(ip:\d+\.\d+\.\d+\.\d+)/gi, '<span class="syntax-address">$1</span>')
                .replace(/(cidr:\d+\.\d+\.\d+\.\d+\/\d+)/gi, '<span class="syntax-address">$1</span>')
                .replace(/\bany\b/gi, '<span class="syntax-any">any</span>')
                .replace(/(port[s]?:[0-9,\-]+)/gi, '<span class="syntax-port">$1</span>');

            if (commentPart) {
                highlighted += `<span class="syntax-comment">${this.escapeHtml(commentPart)}</span>`;
            }

            return highlighted;
        }).join('\n');
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export for use
window.Accordion = Accordion;
window.ToggleSwitch = ToggleSwitch;
window.DetailsPanel = DetailsPanel;
window.FirewallRuleValidator = FirewallRuleValidator;

