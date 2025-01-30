const CONFIGURATOR_DATA = {
  steps: [
    {
      id: 1,
      name: 'Vehicle Selection',
      type: 'select',
      dataKey: 'vehicles',
      required: true,
      configKey: 'vehicle',
      template: 'vehicle-select'
    },
    {
      id: 2,
      name: 'Build Type',
      type: 'card-select',
      dataKey: 'buildTypes',
      required: true,
      configKey: 'buildType',
      template: 'build-type'
    },
    {
      id: 3,
      name: 'Tray Selection',
      type: 'card-select',
      dataKey: 'trays',
      required: true,
      configKey: 'tray',
      template: 'tray',
      showIf: (config) => config.buildType && ['tray-only', 'tray-canopy'].includes(config.buildType.id)
    },
    {
      id: 4,
      name: 'Canopy Selection',
      type: 'card-select',
      dataKey: 'canopies',
      required: true,
      configKey: 'canopy',
      template: 'canopy',
      showIf: (config) => config.buildType && config.buildType.id === 'tray-canopy'
    },
    {
      id: 5,
      name: 'Tray Sides',
      type: 'card-select',
      dataKey: 'traySides',
      required: true,
      configKey: 'traySides',
      template: 'tray-sides',
      showIf: (config) => config.buildType && ['tray-only', 'tray-canopy'].includes(config.buildType.id)
    },
    {
      id: 6,
      name: 'Accessories Selection',
      type: 'multi-select',
      dataKey: 'accessories',
      required: false,
      configKey: 'accessories',
      template: 'accessories'
    },
    {
      id: 7,
      name: 'Summary',
      type: 'summary',
      required: true,
      template: 'summary'
    }
  ],
  buildTypes: [
    {
      id: 'tray-only',
      name: 'Tray Only',
      description: '',
      image: 'https://placehold.co/400x300?text=Tray+Only'
    },
    {
      id: 'tray-canopy',
      name: 'Tray and Canopy',
      description: '',
      image: 'https://placehold.co/400x300?text=Tray+and+Canopy'
    },
    {
      id: 'service-body',
      name: 'Service Body',
      description: '',
      image: 'https://placehold.co/400x300?text=Service+Body'
    }
  ],
  vehicles: [
    {
      id: 1,
      name: 'Toyota Hilux',
      image: 'https://placehold.co/400x300?text=Toyota+Hilux',
      description: 'Dual Cab',
      price: 0,
      gvm: 3000 // GVM in kg
    },
    {
      id: 2,
      name: 'Ford Ranger',
      image: 'https://placehold.co/400x300?text=Ford+Ranger',
      description: 'Dual Cab',
      price: 0,
      gvm: 3200 // GVM in kg
    },
    {
      id: 3,
      name: 'Isuzu D-Max',
      image: 'https://placehold.co/400x300?text=Isuzu+D-Max',
      description: 'Dual Cab',
      price: 0,
      gvm: 2900 // GVM in kg
    }
  ],

  trays: [
    {
      id: 1,
      name: '1700mm Tray',
      image: 'https://placehold.co/400x300?text=1600mm+Tray',
      price: 2500,
      description: 'AS Aluminium Dual Cab Tray 1700mm - Matte Black',
      weight: 95 // Weight in kg
    },
    {
      id: 2,
      name: '2000mm Tray',
      image: 'https://placehold.co/400x300?text=1800mm+Tray',
      price: 2800,
      description: 'AS Aluminium Dual Cab Tray 2000mm - Matte Black',
      weight: 110 // Weight in kg
    },
    {
      id: 3,
      name: '2400mm Tray',
      image: 'https://placehold.co/400x300?text=2000mm+Tray',
      price: 3200,
      description: 'AS Aluminium Dual Cab Tray 2400mm - Matte Black',
      weight: 125 // Weight in kg
    }
  ],

  canopies: [
    {
      id: 1,
      name: '1000mm Canopy',
      image: 'https://placehold.co/400x300?text=1000mm+Canopy',
      price: 3500,
      description: 'AS Aluminium Canopy 1000mm - Matte Black',
      weight: 65 // Weight in kg
    },
    {
      id: 2,
      name: '1400mm Canopy',
      image: 'https://placehold.co/400x300?text=1400mm+Canopy',
      price: 4200,
      description: 'AS Aluminium Canopy 1400mm - Matte Black',
      weight: 80 // Weight in kg
    },
    {
      id: 3,
      name: '1700mm Canopy',
      image: 'https://placehold.co/400x300?text=1600mm+Canopy',
      price: 4800,
      description: 'AS Aluminium Canopy 1700mm - Matte Black',
      weight: 95 // Weight in kg
    }
  ],

  traySides: [
    {
      id: 1,
      name: '300mm Sides',
      image: 'https://placehold.co/400x300?text=300mm+Sides',
      price: 500,
      description: 'AS Aluminium Tray Sides 300mm - Matte Black',
      height: 300 // Height in mm
    },
    {
      id: 2,
      name: '600mm Sides',
      image: 'https://placehold.co/400x300?text=600mm+Sides',
      price: 800,
      description: 'AS Aluminium Tray Sides 600mm - Matte Black',
      height: 600
    },
    {
      id: 3,
      name: '700mm Sides',
      image: 'https://placehold.co/400x300?text=700mm+Sides',
      price: 900,
      description: 'AS Aluminium Tray Sides 700mm - Matte Black',
      height: 700
    },
    {
      id: 4,
      name: '1000mm Sides',
      image: 'https://placehold.co/400x300?text=1000mm+Sides',
      price: 1200,
      description: 'AS Aluminium Tray Sides 1000mm - Matte Black',
      height: 1000
    },
    {
      id: 5,
      name: '1700mm Sides',
      image: 'https://placehold.co/400x300?text=1700mm+Sides',
      price: 1800,
      description: 'AS Aluminium Tray Sides 1700mm - Matte Black',
      height: 1700
    },
    {
      id: 6,
      name: '2000mm Sides',
      image: 'https://placehold.co/400x300?text=2000mm+Sides',
      price: 2000,
      description: 'AS Aluminium Tray Sides 2000mm - Matte Black',
      height: 2000
    },
    {
      id: 7,
      name: '2400mm Sides',
      image: 'https://placehold.co/400x300?text=2400mm+Sides',
      price: 2400,
      description: 'AS Aluminium Tray Sides 2400mm - Matte Black',
      height: 2400
    }
  ],

  accessories: [
    {
      id: 'wheelcarrier1',
      name: 'Spare Wheel Carrier',
      image: 'https://placehold.co/400x300?text=Spare+Wheel+Holder',
      price: 289,
      description: 'AS Spare Wheel Carrier - Matte Black',
      weight: 15 // Weight in kg
    },
    {
      id: 'jerrycan1',
      name: 'Lockable Jerry Can Holder',
      image: 'https://placehold.co/400x300?text=Lockable+Jerry+Can+Holder',
      price: 299,
      description: 'AS Lockable Jerry Can Holder - Matte Black',
      weight: 8 // Weight in kg
    },
    {
      id: 'jerrycan2',
      name: 'AS Jerry Can Holder - Matte Black',
      image: 'https://placehold.co/400x300?text=Jerry+Can+Holder',
      price: 250,
      description: 'AS Jerry Can Holder - Matte Black',
      weight: 6 // Weight in kg
    },
    {
      id: 'pantryslide1',
      name: 'AS Regular Pantry Slide',
      image: 'https://placehold.co/400x300?text=Pantry+Slide',
      price: 800,
      description: 'AS Regular Pantry Slide - Matte Black',
      weight: 25 // Weight in kg
    },
    {
      id: 'fridgeslide1',
      name: 'AS Fridge Slide - 80L',
      image: 'https://placehold.co/400x300?text=Fridge+Slide+80L',
      price: 489,
      description: 'AS Fridge Slide - 80L - Matte Black',
      weight: 35 // Weight in kg
    },
    {
      id: 'fridgeslide2',
      name: 'AS Fridge Slide - 60L',
      image: 'https://placehold.co/400x300?text=Fridge+Slide+60L',
      price: 429,
      description: 'AS Fridge Slide - 60L - Matte Black',
      weight: 30 // Weight in kg
    },
    {
      id: 'fridgeslide3',
      name: 'AS Fridge Slide - 40/50L',
      image: 'https://placehold.co/400x300?text=Fridge+Slide+40/50L',
      price: 359,
      description: 'AS Fridge Slide - 40/50L - Matte Black',
      weight: 25 // Weight in kg
    },
    {
      id: 'rearladder1',
      name: 'AS Rear Ladder - Matte Black',
      image: 'https://placehold.co/400x300?text=Rear+Folding+Ladder',
      price: 369,
      description: 'AS Rear Ladder - Matte Black',
      weight: 12 // Weight in kg
    }
  ]
};