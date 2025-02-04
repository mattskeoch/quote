class ProductConfigurator {
  constructor(container) {
    this.container = container;
    this.currentStep = 1;
    this.steps = CONFIGURATOR_DATA.steps;
    this.totalSteps = this.steps.length;
    this.totalPrice = 0;
    this.totalWeight = 0;
    this.configuration = {
      vehicle: null,
      buildType: null,
      tray: null,
      canopy: null,
      traySides: null,
      passengerFitout: null,
      driverFitout: null,
      accessories: []
    };
    
    this.init();
  }

  init() {
    this.generateStepHTML();
    this.setupEventListeners();
    this.renderCurrentStep();
    this.updateProgress();
    this.updateTotalPrice();
    this.updateTotalWeight();
  }

  generateStepHTML() {
    const container = this.container.querySelector('.configurator-container');
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing content
    
    this.steps.forEach(step => {
      const stepElement = document.createElement('div');
      stepElement.className = 'configurator-step';
      stepElement.setAttribute('data-step', step.id);
      
      stepElement.innerHTML = `
        <h5>${step.name}</h5>
        ${this.getStepContent(step)}
        <div class="step-navigation">
          ${step.id > 1 ? '<button class="button button--secondary" data-prev-step>Previous</button>' : ''}
          ${step.id < this.totalSteps ? '<button class="button" data-next-step>Next</button>' : ''}
          ${step.id === this.totalSteps ? '<button class="button" data-get-quote>Get Quote</button>' : ''}
        </div>
      `;
      
      container.appendChild(stepElement);
    });
  }

  getStepContent(step) {
    switch (step.template) {
      case 'vehicle-select':
        return `
          <select class="vehicle-select" data-vehicle-select>
            <option value="">Select a vehicle</option>
          </select>
          <div data-vehicle-details></div>
        `;
      case 'build-type':
        return '<div class="build-type-options" data-build-type-options></div>';
      case 'tray':
        return '<div class="option-grid" data-tray-options></div>';
      case 'canopy':
        return '<div class="option-grid" data-canopy-options></div>';
      case 'tray-sides':
        return '<div class="option-grid" data-tray-sides-options></div>';
      case 'passenger-fitout':
        return '<div class="option-grid" data-passenger-fitout-options></div>';
      case 'driver-fitout':
        return '<div class="option-grid" data-driver-fitout-options></div>';
      case 'accessories':
        return '<div class="accessories-grid" data-accessories-options></div>';
      case 'summary':
        return '<div class="summary-container" data-summary></div>';
      default:
        return '';
    }
  }

  setupEventListeners() {
    // Generic event delegation for all option selections
    this.container.addEventListener('click', (e) => {
      const optionCard = e.target.closest('.option-card');
      if (optionCard) {
        const currentStep = this.steps.find(s => s.id === this.currentStep);
        if (currentStep) {
          this.updateConfiguration(currentStep.id, optionCard.dataset.optionId, optionCard);
        }
      }
    });

    // Vehicle selection
    const vehicleSelect = this.container.querySelector('[data-vehicle-select]');
    if (vehicleSelect) {
      vehicleSelect.addEventListener('change', (e) => {
        const selectedVehicle = CONFIGURATOR_DATA.vehicles.find(v => v.id === Number(e.target.value));
        if (selectedVehicle) {
          this.configuration.vehicle = selectedVehicle;
          this.renderVehicleDetails(selectedVehicle);
          this.updateTotalPrice();
          this.updateTotalWeight();
        }
      });
    }

    // Navigation buttons
    this.container.addEventListener('click', (e) => {
      if (e.target.matches('[data-prev-step]')) {
        this.prevStep();
      } else if (e.target.matches('[data-next-step]')) {
        this.nextStep();
      } else if (e.target.matches('[data-get-quote]')) {
        this.handleGetQuote();
      }
    });

    // Restart button
    const restartButton = this.container.querySelector('[data-restart]');
    if (restartButton) {
      restartButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.restart();
      });
    }
  }

  getVisibleSteps() {
    return this.steps.filter(step => {
      if (!step.showIf) return true;
      return step.showIf(this.configuration);
    });
  }

  getNextVisibleStep(currentStep) {
    const visibleSteps = this.getVisibleSteps();
    const currentIndex = visibleSteps.findIndex(step => step.id === currentStep);
    return visibleSteps[currentIndex + 1]?.id;
  }

  getPrevVisibleStep(currentStep) {
    const visibleSteps = this.getVisibleSteps();
    const currentIndex = visibleSteps.findIndex(step => step.id === currentStep);
    return visibleSteps[currentIndex - 1]?.id;
  }

  nextStep() {
    const nextStep = this.getNextVisibleStep(this.currentStep);
    if (nextStep) {
      this.currentStep = nextStep;
      this.renderCurrentStep();
      this.updateProgress();
    }
  }

  prevStep() {
    const prevStep = this.getPrevVisibleStep(this.currentStep);
    if (prevStep) {
      this.currentStep = prevStep;
      this.renderCurrentStep();
      this.updateProgress();
    }
  }

  updateProgress() {
    const progress = (this.currentStep - 1) / (this.totalSteps - 1) * 100;
    const progressBar = this.container.querySelector('[data-progress]');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    // Update step counter position and text
    const stepCounter = this.container.querySelector('[data-step-counter]');
    if (stepCounter) {
      stepCounter.textContent = `${this.currentStep}/${this.totalSteps}`;
      stepCounter.style.left = `${progress}%`;
    }

    this.updateNavigationButtons();
  }

  updateStepIndicators() {
    const indicators = this.container.querySelector('[data-step-indicators]');
    if (!indicators) return;

    // Clear existing indicators
    indicators.innerHTML = '';

    // Create new indicators
    for (let i = 1; i <= this.totalSteps; i++) {
      const indicator = document.createElement('div');
      indicator.classList.add('step-indicator');
      if (i < this.currentStep) {
        indicator.classList.add('completed');
      } else if (i === this.currentStep) {
        indicator.classList.add('active');
      }
      indicator.textContent = i;
      indicators.appendChild(indicator);
    }
  }

  updateNavigationButtons() {
    const prevBtn = this.container.querySelector('[data-prev-step]');
    const nextBtn = this.container.querySelector('[data-next-step]');
    const getQuoteBtn = this.container.querySelector('[data-get-quote]');

    if (prevBtn) {
      prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
    }

    if (nextBtn) {
      nextBtn.style.display = this.currentStep < this.totalSteps ? 'block' : 'none';
    }

    if (getQuoteBtn) {
      getQuoteBtn.style.display = this.currentStep === this.totalSteps ? 'block' : 'none';
    }
  }

  renderCurrentStep() {
    const steps = this.container.querySelectorAll('.configurator-step');
    steps.forEach(step => step.style.display = 'none');

    const currentStep = this.steps.find(s => s.id === this.currentStep);
    if (!currentStep) return;

    const stepElement = this.container.querySelector(`[data-step="${this.currentStep}"]`);
    if (!stepElement) return;

    stepElement.style.display = 'block';

    // Render step-specific content
    switch (currentStep.template) {
      case 'vehicle-select':
        this.renderVehicles();
        break;
      case 'build-type':
        this.renderBuildTypes();
        break;
      case 'tray':
        this.renderTrays();
        break;
      case 'canopy':
        this.renderCanopies();
        break;
      case 'tray-sides':
        this.renderTraySideOptions();
        break;
      case 'passenger-fitout':
        this.renderPassengerFitout();
        break;
      case 'driver-fitout':
        this.renderDriverFitout();
        break;
      case 'accessories':
        this.renderAccessories();
        break;
      case 'summary':
        this.renderSummary();
        break;
    }
  }

  renderVehicles() {
    const select = this.container.querySelector('[data-vehicle-select]');
    const detailsContainer = this.container.querySelector('[data-vehicle-details]');
    
    if (!select) return;

    // Populate select options
    const options = CONFIGURATOR_DATA.vehicles.map(vehicle => 
      `<option value="${vehicle.id}">${vehicle.name}</option>`
    ).join('');
    
    select.innerHTML = '<option value="">Choose a vehicle...</option>' + options;

    // Set selected value if there's a selected vehicle
    if (this.configuration.vehicle) {
      select.value = this.configuration.vehicle.id;
      this.renderVehicleDetails(this.configuration.vehicle);
    } else {
      detailsContainer.innerHTML = '';
    }
  }

  renderBuildTypes() {
    const container = this.container.querySelector('[data-build-type-options]');
    if (!container) return;

    container.innerHTML = CONFIGURATOR_DATA.buildTypes
      .map(buildType => `
        <div class="option-card ${this.configuration.buildType?.id === buildType.id ? 'selected' : ''}" 
             data-option-id="${buildType.id}">
          <div class="option-image">
            <img src="${buildType.image}" alt="${buildType.name}" loading="lazy">
          </div>
          <div class="option-details">
            <h3>${buildType.name}</h3>
            ${buildType.description ? `<p>${buildType.description}</p>` : ''}
            ${buildType.price > 0 ? `<div class="option-price">$${buildType.price.toLocaleString()}</div>` : ''}
          </div>
        </div>
      `)
      .join('');
  }

  renderTrays() {
    const container = this.container.querySelector('[data-tray-options]');
    if (!container) return;

    container.innerHTML = CONFIGURATOR_DATA.trays
      .map(tray => `
        <div class="option-card ${this.configuration.tray?.id === tray.id ? 'selected' : ''}" 
             data-option-id="${tray.id}">
          <div class="option-image">
            <img src="${tray.image}" alt="${tray.name}" loading="lazy">
          </div>
          <div class="option-details">
            <h3>${tray.name}</h3>
            ${tray.description ? `<p>${tray.description}</p>` : ''}
            ${tray.price > 0 ? `<div class="option-price">$${tray.price.toLocaleString()}</div>` : ''}
          </div>
        </div>
      `)
      .join('');
  }

  renderCanopies() {
    const container = this.container.querySelector('[data-canopy-options]');
    if (!container) return;

    container.innerHTML = CONFIGURATOR_DATA.canopies
      .map(canopy => `
        <div class="option-card ${this.configuration.canopy?.id === canopy.id ? 'selected' : ''}" 
             data-option-id="${canopy.id}">
          <div class="option-image">
            <img src="${canopy.image}" alt="${canopy.name}" loading="lazy">
          </div>
          <div class="option-details">
            <h3>${canopy.name}</h3>
            ${canopy.description ? `<p>${canopy.description}</p>` : ''}
            ${canopy.price > 0 ? `<div class="option-price">$${canopy.price.toLocaleString()}</div>` : ''}
          </div>
        </div>
      `)
      .join('');
  }

  renderTraySideOptions() {
    const container = this.container.querySelector('[data-tray-sides-options]');
    if (!container) return;

    container.innerHTML = CONFIGURATOR_DATA.traySides
      .map(side => `
        <div class="option-card ${this.configuration.traySides?.id === side.id ? 'selected' : ''}" 
             data-option-id="${side.id}">
          <div class="option-image">
            <img src="${side.image}" alt="${side.name}" loading="lazy">
          </div>
          <div class="option-details">
            <h3>${side.name}</h3>
            ${side.description ? `<p>${side.description}</p>` : ''}
            ${side.price > 0 ? `<div class="option-price">$${side.price.toLocaleString()}</div>` : ''}
          </div>
        </div>
      `)
      .join('');
  }

  renderPassengerFitout() {
    const container = this.container.querySelector('[data-passenger-fitout-options]');
    if (!container) return;

    container.innerHTML = CONFIGURATOR_DATA.passengerFitout
      .map(fitout => `
        <div class="option-card ${this.configuration.passengerFitout?.id === fitout.id ? 'selected' : ''}" 
             data-option-id="${fitout.id}">
          <div class="option-image">
            <img src="${fitout.image}" alt="${fitout.name}" loading="lazy">
          </div>
          <div class="option-details">
            <h3>${fitout.name}</h3>
            ${fitout.description ? `<p>${fitout.description}</p>` : ''}
            ${fitout.price > 0 ? `<div class="option-price">$${fitout.price.toLocaleString()}</div>` : ''}
          </div>
        </div>
      `)
      .join('');
  }

  renderDriverFitout() {
    const container = this.container.querySelector('[data-driver-fitout-options]');
    if (!container) return;

    container.innerHTML = CONFIGURATOR_DATA.driverFitout
      .map(fitout => `
        <div class="option-card ${this.configuration.driverFitout?.id === fitout.id ? 'selected' : ''}" 
             data-option-id="${fitout.id}">
          <div class="option-image">
            <img src="${fitout.image}" alt="${fitout.name}" loading="lazy">
          </div>
          <div class="option-details">
            <h3>${fitout.name}</h3>
            ${fitout.description ? `<p>${fitout.description}</p>` : ''}
            ${fitout.price > 0 ? `<div class="option-price">$${fitout.price.toLocaleString()}</div>` : ''}
          </div>
        </div>
      `)
      .join('');
  }

  renderAccessories() {
    const container = this.container.querySelector('[data-accessories-options]');
    if (!container) return;

    container.innerHTML = CONFIGURATOR_DATA.accessories
      .map(accessory => `
        <div class="option-card ${this.configuration.accessories.some(a => a.id === accessory.id) ? 'selected' : ''}" 
             data-option-id="${accessory.id}">
          <div class="option-image">
            <img src="${accessory.image}" alt="${accessory.name}" loading="lazy">
          </div>
          <div class="option-details">
            <h3>${accessory.name}</h3>
            ${accessory.description ? `<p>${accessory.description}</p>` : ''}
            ${accessory.price > 0 ? `<div class="option-price">$${accessory.price.toLocaleString()}</div>` : ''}
          </div>
        </div>
      `)
      .join('');

    // Setup event listeners after rendering
    this.setupAccessoryEventListeners();
  }

  setupAccessoryEventListeners() {
    const accessoryCards = this.container.querySelectorAll('.option-card[data-option-id]');
    accessoryCards.forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.optionId);
        const accessory = CONFIGURATOR_DATA.accessories.find(a => a.id === id);
        
        if (!accessory) return;

        // Toggle accessory selection
        if (this.configuration.accessories.some(a => a.id === id)) {
          this.configuration.accessories = this.configuration.accessories.filter(a => a.id !== id);
          card.classList.remove('selected');
        } else {
          this.configuration.accessories.push(accessory);
          card.classList.add('selected');
        }

        this.updateTotalPrice();
        this.updateCurrentTotal();
        this.updateTotalWeight();
      });
    });
  }

  updateConfiguration(stepId, optionId, element) {
    const step = this.steps.find(s => s.id === stepId);
    if (!step) return;

    const dataKey = step.dataKey;
    const configKey = step.configKey;

    if (configKey === 'accessories') {
      // Handle multi-select for accessories
      element.classList.toggle('selected');
      const accessory = CONFIGURATOR_DATA[dataKey].find(a => a.id === optionId);
      
      if (element.classList.contains('selected')) {
        if (!this.configuration.accessories.find(a => a.id === accessory.id)) {
          this.configuration.accessories.push(accessory);
        }
      } else {
        this.configuration.accessories = this.configuration.accessories.filter(a => a.id !== accessory.id);
      }
    } else {
      // Handle single-select for other options
      const siblings = element.parentElement.querySelectorAll('.option-card');
      siblings.forEach(card => card.classList.remove('selected'));
      element.classList.add('selected');

      const selectedOption = CONFIGURATOR_DATA[dataKey].find(item => {
        if (typeof item.id === 'number') {
          return item.id === Number(optionId);
        }
        return item.id === optionId;
      });

      this.configuration[configKey] = selectedOption;
    }

    this.updateTotalPrice();
    this.updateTotalWeight();
  }

  renderVehicleDetails(vehicle) {
    const detailsContainer = this.container.querySelector('[data-vehicle-details]');
    if (!detailsContainer || !vehicle) return;

    detailsContainer.innerHTML = `
      <div class="vehicle-details-content">
        <div class="vehicle-details-info">
          <div class="vehicle-details-name">${vehicle.name}</div>
          <div class="vehicle-details-description">${vehicle.description}</div>
        </div>
        <div class="vehicle-details-price">$${vehicle.price.toLocaleString()}</div>
      </div>
    `;
  }

  updateTotalPrice() {
    let total = 0;
    
    // Add vehicle price if selected
    if (this.configuration.vehicle) {
      total += this.configuration.vehicle.price;
    }
    
    // Add tray price if selected
    if (this.configuration.tray) {
      total += this.configuration.tray.price;
    }
    
    // Add canopy price if selected
    if (this.configuration.canopy) {
      total += this.configuration.canopy.price;
    }

    // Add tray sides price if selected
    if (this.configuration.traySides) {
      total += this.configuration.traySides.price;
    }

    // Add passenger fitout price if selected
    if (this.configuration.passengerFitout) {
      total += this.configuration.passengerFitout.price;
    }

    // Add driver fitout price if selected
    if (this.configuration.driverFitout) {
      total += this.configuration.driverFitout.price;
    }
    
    // Add accessories prices
    if (this.configuration.accessories.length > 0) {
      total += this.configuration.accessories.reduce((sum, acc) => sum + acc.price, 0);
    }
    
    this.totalPrice = total;
    this.updateCurrentTotal();
  }

  updateCurrentTotal() {
    const currentTotalElement = this.container.querySelector('[data-current-total]');
    if (currentTotalElement) {
      currentTotalElement.textContent = `$${this.totalPrice.toFixed(2)}`;
    }
  }

  updateTotalWeight() {
    this.totalWeight = 0;
    
    // Add vehicle weight if selected
    if (this.configuration.vehicle) {
      this.totalWeight += this.configuration.vehicle.weight || 0;
    }
    
    // Add build type weight if selected
    if (this.configuration.buildType) {
      this.totalWeight += this.configuration.buildType.weight || 0;
    }
    
    // Add tray weight
    if (this.configuration.tray) {
      this.totalWeight += this.configuration.tray.weight || 0;
    }

    // Add canopy weight
    if (this.configuration.canopy) {
      this.totalWeight += this.configuration.canopy.weight || 0;
    }

    // Add tray sides weight
    if (this.configuration.traySides) {
      this.totalWeight += this.configuration.traySides.weight || 0;
    }

    // Add passenger fitout weight
    if (this.configuration.passengerFitout) {
      this.totalWeight += this.configuration.passengerFitout.weight || 0;
    }

    // Add driver fitout weight
    if (this.configuration.driverFitout) {
      this.totalWeight += this.configuration.driverFitout.weight || 0;
    }

    // Add accessories weight
    this.configuration.accessories.forEach(accessory => {
      this.totalWeight += accessory.weight || 0;
    });

    this.updateWeightDisplay();
  }

  updateWeightDisplay() {
    const weightInfo = this.container.querySelector('[data-weight-info]');
    if (!weightInfo) return;

    const weightValue = weightInfo.querySelector('.weight-value');
    const gvmValue = weightInfo.querySelector('.gvm-value');

    // Update current weight
    weightValue.textContent = this.totalWeight;

    // Update GVM limit if vehicle is selected
    if (this.configuration.vehicle && this.configuration.vehicle.gvm) {
      gvmValue.textContent = this.configuration.vehicle.gvm;

      // Add warning class if weight exceeds GVM
      if (this.totalWeight > this.configuration.vehicle.gvm) {
        weightValue.classList.add('exceeded');
      } else {
        weightValue.classList.remove('exceeded');
      }
    } else {
      gvmValue.textContent = '--';
      weightValue.classList.remove('exceeded');
    }
  }

  renderSummary() {
    const summaryContainer = this.container.querySelector('[data-summary]');
    if (!summaryContainer) return;

    let summaryHtml = '';

    // Vehicle
    if (this.configuration.vehicle) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Vehicle</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.vehicle.name}</div>
              <div class="summary-item-description">${this.configuration.vehicle.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.vehicle.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Build Type
    if (this.configuration.buildType) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Build Type</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.buildType.name}</div>
              <div class="summary-item-description">${this.configuration.buildType.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.buildType.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Tray
    if (this.configuration.tray) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Tray</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.tray.name}</div>
              <div class="summary-item-description">${this.configuration.tray.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.tray.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Canopy
    if (this.configuration.canopy) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Canopy</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.canopy.name}</div>
              <div class="summary-item-description">${this.configuration.canopy.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.canopy.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Tray Sides
    if (this.configuration.traySides) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Tray Sides</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.traySides.name}</div>
              <div class="summary-item-description">${this.configuration.traySides.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.traySides.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Passenger Fitout
    if (this.configuration.passengerFitout) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Passenger Fitout</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.passengerFitout.name}</div>
              <div class="summary-item-description">${this.configuration.passengerFitout.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.passengerFitout.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Driver Fitout
    if (this.configuration.driverFitout) {
      summaryHtml += `
        <div class="summary-section">
          <h3>Driver Fitout</h3>
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${this.configuration.driverFitout.name}</div>
              <div class="summary-item-description">${this.configuration.driverFitout.description}</div>
            </div>
            <div class="summary-item-price">$${(this.configuration.driverFitout.price || 0).toLocaleString()}</div>
          </div>
        </div>
      `;
    }

    // Accessories
    if (this.configuration.accessories && this.configuration.accessories.length > 0) {
      summaryHtml += '<div class="summary-section"><h3>Accessories</h3>';
      
      this.configuration.accessories.forEach(accessory => {
        summaryHtml += `
          <div class="summary-item">
            <div class="summary-item-details">
              <div class="summary-item-name">${accessory.name}</div>
              <div class="summary-item-description">${accessory.description}</div>
            </div>
            <div class="summary-item-price">$${(accessory.price || 0).toLocaleString()}</div>
          </div>
        `;
      });
      
      summaryHtml += '</div>';
    }

    summaryContainer.innerHTML = summaryHtml || '<p>No items selected</p>';
    
    // Update the total price display
    const totalPriceContainer = this.container.querySelector('[data-total-price]');
    if (totalPriceContainer) {
      totalPriceContainer.textContent = `Total: $${this.totalPrice.toFixed(2)}`;
    }
  }

  initSummary() {
    const summaryContainer = this.container.querySelector('[data-summary]');
    if (!summaryContainer) return;

    summaryContainer.innerHTML = this.generateSummaryHTML();
    
    // Add quote button click handler
    const quoteButton = summaryContainer.querySelector('[data-get-quote]');
    if (quoteButton) {
      quoteButton.addEventListener('click', this.openQuoteModal.bind(this));
    }
  }

  openQuoteModal() {
    const modal = document.getElementById('quoteModal');
    if (!modal) return;

    // Add active class to trigger fade-in
    modal.classList.add('active');

    // Handle close button click
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeQuoteModal(modal));
    }

    // Handle overlay click
    const overlay = modal.querySelector('.quote-modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.closeQuoteModal(modal));
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  closeQuoteModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  async handleQuoteSubmit(event) {
    event.preventDefault();
  }

  handleGetQuote() {
    this.openQuoteModal();
  }

  showStep(step) {
    this.container.querySelectorAll('.configurator-step').forEach(s => {
      if (parseInt(s.dataset.step) === step) {
        s.style.display = 'block';
        s.classList.add('active');
      } else {
        s.style.display = 'none';
        s.classList.remove('active');
      }
    });

    // Update data-current-step attribute on the container
    this.container.dataset.currentStep = step;

    // Update button visibility
    const prevButton = this.container.querySelector('[data-prev-step]');
    const nextButton = this.container.querySelector('[data-next-step]');
    const getQuoteButton = this.container.querySelector('[data-get-quote]');

    if (prevButton) prevButton.style.display = step > 1 ? 'block' : 'none';
    if (nextButton) nextButton.style.display = step < this.totalSteps ? 'block' : 'none';
    if (getQuoteButton) getQuoteButton.style.display = step === this.totalSteps ? 'block' : 'none';

    this.renderCurrentStep();
  }

  showSummaryModal() {
    const modal = document.createElement('div');
    modal.classList.add('configurator-modal');
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Configuration Summary</h2>
        <div class="modal-body">
          ${this.container.querySelector('[data-summary]').innerHTML}
          <div class="modal-total">
            ${this.container.querySelector('[data-total-price]').innerHTML}
          </div>
        </div>
        <button class="btn btn-primary" onclick="this.closest('.configurator-modal').remove()">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  restart() {
    // Reset configuration
    this.configuration = {
      vehicle: null,
      buildType: null,
      tray: null,
      canopy: null,
      traySides: null,
      passengerFitout: null,
      driverFitout: null,
      accessories: []
    };
    
    // Reset UI
    this.container.querySelectorAll('.option-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    // Reset vehicle select
    const vehicleSelect = this.container.querySelector('[data-vehicle-select]');
    if (vehicleSelect) {
      vehicleSelect.value = '';
    }
    
    // Reset vehicle details
    const detailsContainer = this.container.querySelector('[data-vehicle-details]');
    if (detailsContainer) {
      detailsContainer.innerHTML = '';
    }
    
    // Reset totals
    this.totalPrice = 0;
    this.totalWeight = 0;
    this.updateTotalPrice();
    this.updateCurrentTotal();
    this.updateTotalWeight();
    
    // Go back to step 1
    this.currentStep = 1;
    this.renderCurrentStep();
    this.updateProgress();
  }

  createOptionCard(option) {
    return `
      <div class="option-card ${this.configuration.traySides?.id === option.id ? 'selected' : ''}" 
           data-option-id="${option.id}">
        <img src="${option.image}" alt="${option.name}">
        <h3>${option.name}</h3>
        <p>${option.description}</p>
        <p class="price">$${option.price.toFixed(2)}</p>
      </div>
    `;
  }
}

// Initialize the configurator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('[data-configurator]');
  new ProductConfigurator(container);
});