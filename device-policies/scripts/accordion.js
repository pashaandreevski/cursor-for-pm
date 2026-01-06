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

// Export for use
window.Accordion = Accordion;
window.ToggleSwitch = ToggleSwitch;
window.DetailsPanel = DetailsPanel;

