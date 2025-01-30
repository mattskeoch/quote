const CONFIGURATOR_DATA = {
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