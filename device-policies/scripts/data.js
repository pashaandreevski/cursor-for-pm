// ===============================================
// MOCK DATA FOR DEVICE POLICIES PROTOTYPE
// ===============================================

const DATA = {
    // Service Policies
    servicePolicies: [
        {
            id: '401301',
            name: 'All services enabled',
            attachedDevices: 137,
            breakoutRegion: {
                type: 'automatic',
                name: 'Automatic Breakout Region',
                icon: 'globe'
            },
            details: {
                allowsCode: '0 SMS',
                data: {
                    internetBreakoutRegion: 'Automatic Breakout Region',
                    cellularConnectivity: true,
                    satelliteConnectivity: false,
                    ratTypes: {
                        '2G': true,
                        '3G': true,
                        '4G/LTE': true,
                        'NB-IoT': true
                    },
                    usageLimit: '10 MB',
                    softLimit: true,
                    softLimitThreshold: '70%',
                    customDns: {
                        enabled: true,
                        primary: '208.67.222.222',
                        secondary: '208.67.208.206'
                    },
                    dataQuota: {
                        enabled: false,
                        value: null
                    }
                },
                sms: {
                    interface: 'Web Portal',
                    outbound: true,
                    outboundLimit: '15 SMS per region',
                    inbound: false,
                    permissions: {
                        deviceToDevice: true,
                        external: true
                    },
                    quota: {
                        enabled: false,
                        value: null
                    }
                }
            }
        },
        {
            id: '1441525',
            name: 'New service policy',
            attachedDevices: null,
            breakoutRegion: {
                type: 'vpn',
                name: 'eu-west-1 (VPN)',
                icon: 'vpn'
            },
            details: {
                allowsCode: '0 SMS',
                data: {
                    internetBreakoutRegion: 'eu-west-1 (VPN)',
                    cellularConnectivity: true,
                    satelliteConnectivity: false,
                    ratTypes: {
                        '2G': false,
                        '3G': false,
                        '4G/LTE': true,
                        'NB-IoT': false
                    },
                    usageLimit: null,
                    softLimit: false,
                    softLimitThreshold: null,
                    customDns: {
                        enabled: false,
                        primary: null,
                        secondary: null
                    },
                    dataQuota: {
                        enabled: false,
                        value: null
                    }
                },
                sms: {
                    interface: 'Web Portal',
                    outbound: false,
                    outboundLimit: null,
                    inbound: false,
                    permissions: {
                        deviceToDevice: false,
                        external: false
                    },
                    quota: {
                        enabled: false,
                        value: null
                    }
                }
            }
        }
    ],

    // Coverage Policies
    coveragePolicies: [
        {
            id: '1169049',
            name: 'Europe',
            attachedDevices: 137,
            dataAllowance: 'Europe Basic 10 MB',
            dataPlan: 'Europe Basic 10 MB',
            details: {
                includedCoverage: [
                    {
                        zone: 'Zone 1',
                        countries: ['eu', 'us'],
                        countryCount: 4,
                        dataPrice: '€0.001 / kB',
                        priceRange: '€0.24 - €10.24/M',
                        smsPriceRange: '€0.07€ - 0.60 M'
                    }
                ],
                additionalCoverage: [
                    {
                        zone: 'Zone 1A',
                        countries: ['fr', 'it'],
                        countryCount: 8,
                        dataPrice: '€7.50 / MB',
                        priceRange: '€0.83 - €10.83/M',
                        smsPriceRange: '€0.07€ - 0.60 M',
                        enabled: false
                    },
                    {
                        zone: 'Zone 1I',
                        countries: ['es', 'pt'],
                        countryCount: 4,
                        dataPrice: '€7.50 / MB',
                        priceRange: '€0.45 - €10.83/M',
                        smsPriceRange: '€0.07€ - 0.60 M',
                        enabled: false
                    },
                    {
                        zone: 'Zone 2',
                        countries: ['us', 'ca'],
                        countryCount: 44,
                        dataPrice: '€0.06 / MB',
                        priceRange: '€0.05 - €10.83/M',
                        smsPriceRange: '€0.07€ - 0.60 M',
                        enabled: false
                    },
                    {
                        zone: 'Zone 3',
                        countries: ['br', 'mx'],
                        countryCount: 24,
                        dataPrice: '€0.012 / kB',
                        priceRange: '€0.05 - €10.83/M',
                        smsPriceRange: '€0.07€ - 0.60 M',
                        enabled: false
                    },
                    {
                        zone: 'Zone 4',
                        countries: ['au', 'nz'],
                        countryCount: 6,
                        dataPrice: '€0.014 / kB',
                        priceRange: '€0.085 - €10.83/M',
                        smsPriceRange: '€0.07€ - 0.60 M',
                        enabled: false
                    },
                    {
                        zone: 'Zone 5',
                        countries: ['jp', 'kr'],
                        countryCount: 2,
                        dataPrice: '€0.076 / kB',
                        priceRange: '€0.05 - €10.83/M',
                        smsPriceRange: '€0.07€ - 0.60 M',
                        enabled: false
                    },
                    {
                        zone: 'Zone 6',
                        countries: ['cn', 'hk'],
                        countryCount: 3,
                        dataPrice: '€0.136 / kB',
                        priceRange: '€12.50 - €10.83/M',
                        smsPriceRange: '€0.07€ - 0.60 M',
                        enabled: false
                    },
                    {
                        zone: 'Zone 7',
                        countries: ['in', 'pk'],
                        countryCount: 2,
                        dataPrice: '€0.052 / MB',
                        priceRange: '€1.35 - €10.83/M',
                        smsPriceRange: '€0.07€ - 0.60 M',
                        enabled: false
                    },
                    {
                        zone: 'Zone 8',
                        countries: ['za', 'ng'],
                        countryCount: 5,
                        dataPrice: '€0.29 / MB',
                        priceRange: '€9.00€',
                        smsPriceRange: '€0.07€ - 0.60 M',
                        enabled: false
                    },
                    {
                        zone: 'Zone 9',
                        countries: ['ae', 'sa'],
                        countryCount: 4,
                        dataPrice: '€0.465 / kB',
                        priceRange: '€1.430 - €10.83/M',
                        smsPriceRange: '€0.07€ - 0.60 M',
                        enabled: false
                    }
                ]
            }
        }
    ],

    // IP Address Spaces
    ipAddressSpaces: [
        {
            id: '990',
            ipAddressSpace: '10.64.216.0/22',
            allocatedIPs: 167,
            availableIPs: 315,
            status: 'assigned'
        },
        {
            id: '1347',
            ipAddressSpace: '10.95.67.0/24',
            allocatedIPs: 29,
            availableIPs: 125,
            status: 'assigned'
        },
        {
            id: '2181',
            ipAddressSpace: '10.10.71.0/24',
            allocatedIPs: 1,
            availableIPs: 253,
            status: 'assigned'
        }
    ],

    // Countries for coverage list
    countries: [
        { code: 'AL', name: 'Albania', flag: '🇦🇱', availableNetworks: 2, enabledNetworks: 2, directNetworks: 0, directRatTypes: 0, hasFullAccess: true },
        { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', availableNetworks: 1, enabledNetworks: 0, directNetworks: 0, directRatTypes: 0, hasFullAccess: false },
        { code: 'AX', name: 'Åland Islands', flag: '🇦🇽', availableNetworks: 2, enabledNetworks: 1, directNetworks: 0, directRatTypes: 0, hasFullAccess: false },
        { code: 'DZ', name: 'Algeria', flag: '🇩🇿', availableNetworks: 3, enabledNetworks: 0, directNetworks: 0, directRatTypes: 0, hasFullAccess: false },
        { code: 'AS', name: 'American Samoa', flag: '🇦🇸', availableNetworks: 1, enabledNetworks: 0, directNetworks: 0, directRatTypes: 0, hasFullAccess: true },
        { code: 'AD', name: 'Andorra', flag: '🇦🇩', availableNetworks: 1, enabledNetworks: 1, directNetworks: 0, directRatTypes: 0, hasFullAccess: false },
        { code: 'AO', name: 'Angola', flag: '🇦🇴', availableNetworks: 2, enabledNetworks: 0, directNetworks: 0, directRatTypes: 0, hasFullAccess: false },
        { code: 'AI', name: 'Anguilla', flag: '🇦🇮', availableNetworks: 1, enabledNetworks: 0, directNetworks: 0, directRatTypes: 0, hasFullAccess: false },
        { code: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬', availableNetworks: 2, enabledNetworks: 0, directNetworks: 0, directRatTypes: 0, hasFullAccess: false }
    ]
};

// Export for use in other scripts
window.DATA = DATA;

