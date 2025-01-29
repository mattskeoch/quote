  class ProductConfigurator {
  constructor(container) {
    this.container = container;
    this.currentStep = 1;
    this.totalSteps = 6; // Increased total steps
    this.totalPrice = 0;
    this.totalWeight = 0;
    this.configuration = {
      vehicle: null,
      buildType: null,
      tray: null,
      canopy: null,
      accessories: []
    };
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderCurrentStep();
    this.updateProgress();
  }

  setupEventListeners() {
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

    // Build Type selection
    const buildTypeContainer = this.container.querySelector('[data-build-type-options]');
    if (buildTypeContainer) {
      buildTypeContainer.addEventListener('click', (e) => {
        const optionCard = e.target.closest('.option-card');
        if (optionCard) {
          const buildTypeId = optionCard.dataset.optionId;
          this.updateConfiguration(2, buildTypeId, optionCard);
        }
      });
    }

    // Tray selection
    const trayContainer = this.container.querySelector('[data-tray-options]');
    if (trayContainer) {
      trayContainer.addEventListener('click', (e) => {
        const optionCard = e.target.closest('.option-card');
        if (optionCard) {
          const trayId = optionCard.dataset.optionId;
          this.updateConfiguration(3, trayId, optionCard);
        }
      });
    }

    // Canopy selection
    const canopyContainer = this.container.querySelector('[data-canopy-options]');
    if (canopyContainer) {
      canopyContainer.addEventListener('click', (e) => {
        const optionCard = e.target.closest('.option-card');
        if (optionCard) {
          const canopyId = optionCard.dataset.optionId;
          this.updateConfiguration(4, canopyId, optionCard);
        }
      });
    }

    // Accessories selection
    const accessoriesContainer = this.container.querySelector('[data-accessories-options]');
    if (accessoriesContainer) {
      accessoriesContainer.addEventListener('click', (e) => {
        const optionCard = e.target.closest('.option-card');
        if (optionCard) {
          const accessoryId = optionCard.dataset.optionId;
          this.updateConfiguration(5, accessoryId, optionCard);
        }
      });
    }

    // Navigation buttons
    const prevButtons = this.container.querySelectorAll('[data-prev-step]');
    const nextButtons = this.container.querySelectorAll('[data-next-step]');
    
    prevButtons.forEach(button => {
      button.addEventListener('click', () => this.prevStep());
    });
    
    nextButtons.forEach(button => {
      button.addEventListener('click', () => this.nextStep());
    });

    // Summary button listener
    const addToCartBtn = this.container.querySelector('[data-add-to-cart]');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => this.showSummaryModal());
    }

    // Restart link listener
    const restartLink = this.container.querySelector('[data-restart]');
    if (restartLink) {
      restartLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.restart();
      });
    }
  }

  updateProgress() {
    const progress = (this.currentStep - 1) / (this.totalSteps - 1) * 100;
    const progressBar = this.container.querySelector('[data-progress]');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    this.updateStepIndicators();
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
    const addToCartBtn = this.container.querySelector('[data-add-to-cart]');

    if (prevBtn) {
      prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
    }

    if (nextBtn) {
      nextBtn.style.display = this.currentStep < this.totalSteps ? 'block' : 'none';
    }

    if (addToCartBtn) {
      addToCartBtn.style.display = this.currentStep === this.totalSteps ? 'block' : 'none';
    }
  }

  renderCurrentStep() {
    const steps = this.container.querySelectorAll('.configurator-step');
    steps.forEach(step => {
      step.classList.remove('active');
    });

    const currentStep = this.container.querySelector(`[data-step="${this.currentStep}"]`);
    if (currentStep) {
      currentStep.classList.add('active');
    }

    switch (this.currentStep) {
      case 1:
        this.renderVehicles();
        break;
      case 2:
        this.renderBuildTypes();
        break;
      case 3:
        this.renderTrays();
        break;
      case 4:
        this.renderCanopies();
        break;
      case 5:
        this.renderAccessories();
        break;
      case 6:
        this.renderSummary();
        break;
    }

    // Update total price display
    this.updateCurrentTotal();
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

  createOptionCard(option, isAccessory = false) {
    const selected = this.isSelected(option) ? 'selected' : '';
    return `
      <div class="option-card ${selected}" data-option-id="${option.id}">
        <div class="option-image">
          <img src="${option.image}" alt="${option.name}" loading="lazy">
        </div>
        <div class="option-details">
          <h3>${option.name}</h3>
          ${option.description ? `<p>${option.description}</p>` : ''}
          ${option.price > 0 ? `<div class="option-price">$${option.price.toLocaleString()}</div>` : ''}
          ${isAccessory ? '<div class="option-toggle">Add to Build</div>' : ''}
        </div>
      </div>
    `;
  }

  handleCategorySelection(categoryItem) {
    const categoryId = categoryItem.dataset.categoryId;
    const category = CONFIGURATOR_DATA.accessoryCategories
      .find(cat => cat.id === categoryId);

    if (!category) return;

    // Update active category
    const categories = this.container.querySelectorAll('.category-item');
    categories.forEach(cat => {
      cat.classList.toggle('active', cat.dataset.categoryId === categoryId);
    });

    // Render accessories for this category
    const optionsContainer = this.container.querySelector('[data-accessories-options]');
    if (optionsContainer) {
      optionsContainer.innerHTML = category.accessories
        .map(accessory => {
          const selected = this.configuration.accessories.some(a => a.id === accessory.id);
          return `
            <div class="option-card ${selected ? 'selected' : ''}" data-option-id="${accessory.id}">
              <div class="option-image">
                <img src="${accessory.image}" alt="${accessory.name}" loading="lazy">
              </div>
              <div class="option-details">
                <h3>${accessory.name}</h3>
                ${accessory.description ? `<p>${accessory.description}</p>` : ''}
                ${accessory.price > 0 ? `<div class="option-price">$${accessory.price.toLocaleString()}</div>` : ''}
                <div class="option-toggle">${selected ? 'Remove from Build' : 'Add to Build'}</div>
              </div>
            </div>
          `;
        })
        .join('');
    }
  }

  handleVehicleSelection(vehicle) {
    if (!vehicle) {
      this.configuration.vehicle = null;
      const detailsContainer = this.container.querySelector('[data-vehicle-details]');
      if (detailsContainer) {
        detailsContainer.innerHTML = '';
      }
    } else {
      this.configuration.vehicle = vehicle;
      this.renderVehicleDetails(vehicle);
      
      // Clear other selections when vehicle changes
      this.configuration.tray = null;
      this.configuration.canopy = null;
      this.configuration.accessories = [];
      
      // Reset displays for other steps
      const trayOptions = this.container.querySelector('[data-tray-options]');
      const canopyOptions = this.container.querySelector('[data-canopy-options]');
      const accessoryOptions = this.container.querySelector('[data-accessories-options]');
      
      if (trayOptions) trayOptions.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
      if (canopyOptions) canopyOptions.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
      if (accessoryOptions) accessoryOptions.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
    }
    
    this.updateTotalPrice();
    this.updateCurrentTotal();
    this.updateTotalWeight();
  }

  updateConfiguration(step, id, optionCard) {
    switch (step) {
      case 1:
        // Vehicle selection is handled separately
        break;
      case 2:
        // Build Type selection
        const buildType = CONFIGURATOR_DATA.buildTypes.find(b => b.id === id);
        if (buildType) {
          this.configuration.buildType = buildType;
          // Clear subsequent selections when build type changes
          this.configuration.tray = null;
          this.configuration.canopy = null;
          this.configuration.accessories = [];
          
          // Update UI
          const container = optionCard.closest('[data-step]');
          container.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
          });
          optionCard.classList.add('selected');
        }
        break;
      case 3:
        // Tray selection
        if (this.configuration.buildType && this.configuration.buildType.id !== 'service-body') {
          const tray = CONFIGURATOR_DATA.trays.find(t => t.id === Number(id));
          if (tray) {
            this.configuration.tray = tray;
            // Update UI
            const trayContainer = optionCard.closest('[data-step]');
            trayContainer.querySelectorAll('.option-card').forEach(card => {
              card.classList.remove('selected');
            });
            optionCard.classList.add('selected');
            this.updateTotalWeight();
          }
        }
        break;
      case 4:
        // Canopy selection (only for tray-canopy build type)
        if (this.configuration.buildType && this.configuration.buildType.id === 'tray-canopy') {
          const canopy = CONFIGURATOR_DATA.canopies.find(c => c.id === Number(id));
          if (canopy) {
            this.configuration.canopy = canopy;
            // Update UI
            const canopyContainer = optionCard.closest('[data-step]');
            canopyContainer.querySelectorAll('.option-card').forEach(card => {
              card.classList.remove('selected');
            });
            optionCard.classList.add('selected');
            this.updateTotalWeight();
          }
        }
        break;
      case 5:
        // Accessories
        const accessory = CONFIGURATOR_DATA.accessories.find(a => a.id === id);
        if (accessory) {
          const index = this.configuration.accessories.findIndex(a => a.id === id);
          if (index === -1) {
            this.configuration.accessories.push(accessory);
            optionCard.classList.add('selected');
          } else {
            this.configuration.accessories.splice(index, 1);
            optionCard.classList.remove('selected');
          }
          this.updateTotalWeight();
        }
        break;
    }

    this.updateTotalPrice();
    this.updateCurrentTotal();
  }

  shouldShowStep(step) {
    switch (step) {
      case 1: // Vehicle Selection
        return true;
      case 2: // Build Type
        return true;
      case 3: // Tray Selection
        return this.configuration.buildType && this.configuration.buildType.id !== 'service-body';
      case 4: // Canopy Selection
        return this.configuration.buildType && this.configuration.buildType.id === 'tray-canopy';
      case 5: // Accessories
        return true;
      case 6: // Summary
        return true;
      default:
        return false;
    }
  }

  nextStep() {
    let nextStep = this.currentStep + 1;
    while (nextStep <= this.totalSteps && !this.shouldShowStep(nextStep)) {
      nextStep++;
    }
    
    if (nextStep <= this.totalSteps) {
      this.currentStep = nextStep;
      this.renderCurrentStep();
      this.updateProgress();
    }
  }

  prevStep() {
    let prevStep = this.currentStep - 1;
    while (prevStep >= 1 && !this.shouldShowStep(prevStep)) {
      prevStep--;
    }
    
    if (prevStep >= 1) {
      this.currentStep = prevStep;
      this.renderCurrentStep();
      this.updateProgress();
    }
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
    this.totalPrice = 0;
    
    // Add vehicle price if selected
    if (this.configuration.vehicle) {
      this.totalPrice += this.configuration.vehicle.price || 0;
    }
    
    // Add build type price if selected
    if (this.configuration.buildType) {
      this.totalPrice += this.configuration.buildType.price || 0;
    }
    
    // Add tray price if selected
    if (this.configuration.tray) {
      this.totalPrice += this.configuration.tray.price || 0;
    }
    
    // Add canopy price if selected
    if (this.configuration.canopy) {
      this.totalPrice += this.configuration.canopy.price || 0;
    }
    
    // Add accessories prices
    if (this.configuration.accessories.length > 0) {
      this.configuration.accessories.forEach(accessory => {
        this.totalPrice += accessory.price || 0;
      });
    }

    // Update the current total display
    this.updateCurrentTotal();
  }

  updateCurrentTotal() {
    const currentTotalElement = this.container.querySelector('[data-current-total]');
    if (currentTotalElement) {
      currentTotalElement.textContent = `$${this.totalPrice.toLocaleString()}`;
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
      totalPriceContainer.textContent = `Total: $${this.totalPrice.toLocaleString()}`;
    }
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
    const addToCartButton = this.container.querySelector('[data-add-to-cart]');

    if (prevButton) prevButton.style.display = step > 1 ? 'block' : 'none';
    if (nextButton) nextButton.style.display = step < this.totalSteps ? 'block' : 'none';
    if (addToCartButton) addToCartButton.style.display = step === this.totalSteps ? 'block' : 'none';

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
}

// Initialize the configurator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('[data-configurator]');
  new ProductConfigurator(container);
});
