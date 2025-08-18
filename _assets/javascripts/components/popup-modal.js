class PopupModal extends HTMLElement {
  constructor() {
    super();
    this.hasBeenShown = false;
    console.log('PopupModal: Component instantiated');
  }

  connectedCallback() {
    console.log('PopupModal: Connected to DOM');
    this.checkAndShowModal();
  }

  checkAndShowModal() {
    // Debug logging
    console.log('PopupModal: Checking for UTM parameters...');
    console.log('Current URL:', window.location.href);
    
    // Check for UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const hasUTMSource = urlParams.get('utm_source');
    const hasUTMCampaign = urlParams.get('utm_campaign');
    
    console.log('UTM Source:', hasUTMSource);
    console.log('UTM Campaign:', hasUTMCampaign);
    
    // Only show if there are UTM parameters present
    if (!hasUTMSource && !hasUTMCampaign) {
      console.log('PopupModal: No UTM parameters found, not showing modal');
      return;
    }

    // Check localStorage to see if form has been filled out before
    const hasFilledForm = localStorage.getItem('crossroads-marketing-form-completed');
    console.log('Form previously completed:', hasFilledForm);
    
    if (hasFilledForm === 'true') {
      console.log('PopupModal: Form already completed, not showing modal');
      return;
    }

    console.log('PopupModal: Showing modal');
    // Show the modal
    this.showModal();
  }

  showModal() {
    if (this.hasBeenShown) return;
    
    this.hasBeenShown = true;
    console.log('PopupModal: Creating modal HTML');
    
    // Create modal HTML using project's styling classes
    this.innerHTML = `
      <div class="modal fade show" id="marketingPopupModal" tabindex="-1" role="dialog" aria-labelledby="marketingModalLabel" style="display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1050; background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog" role="document" style="margin: 30px auto; max-width: 500px;">
          <div class="modal-content bg-tan">
            <div class="modal-header hard-bottom">
              <button type="button" class="close pull-right" data-dismiss="modal" aria-label="Close" id="marketingPopupClose">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body text-left hard-bottom">
              <h2 class="font-family-condensed-extra text-uppercase flush-top push-half-bottom text-blue">What if Crossroads came to your city?</h2>
              <p class="tagline push-bottom text-blue">Drop your info to know more:</p>
              
              <form name="marketing-campaign" method="POST" netlify netlify-honeypot="bot-field" class="form" id="marketingPopupForm">
                <input type="hidden" name="form-name" value="marketing-campaign" />
                <p class="hidden">
                  <label>Don't fill this out if you're human: <input name="bot-field" /></label>
                </p>
                
                <div class="form-group push-half-bottom">
                  <input type="text" name="name" placeholder="Name" required class="form-control">
                </div>
                
                <div class="form-group push-half-bottom">
                  <input type="email" name="email" placeholder="Email" required class="form-control">
                </div>
                
                <div class="form-group push-bottom">
                  <input type="text" name="zip" placeholder="Zip" required class="form-control">
                </div>
                
                <input type="hidden" name="utm_source" id="utmSource" />
                <input type="hidden" name="utm_campaign" id="utmCampaign" />
                <input type="hidden" name="utm_medium" id="utmMedium" />
                <input type="hidden" name="referrer_url" id="referrerUrl" />
                
                <button type="submit" class="btn btn-orange">Submit</button>
              </form>
            </div>
            <div class="modal-footer">&nbsp;</div>
          </div>
        </div>
      </div>
    `;

    // Capture UTM parameters and referrer for form submission
    this.captureUTMData();

    console.log('PopupModal: Modal HTML created, adding event listeners');
    console.log('Modal element in DOM:', document.getElementById('marketingPopupModal'));

    // Add event listeners
    document.getElementById('marketingPopupClose').addEventListener('click', this.closeModal.bind(this));
    document.getElementById('marketingPopupForm').addEventListener('submit', this.handleFormSubmit.bind(this));
    this.addEventListener('click', this.handleModalClick.bind(this));
    
    // Add escape key listener
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  captureUTMData() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const utmSource = urlParams.get('utm_source') || '';
    const utmCampaign = urlParams.get('utm_campaign') || '';
    const utmMedium = urlParams.get('utm_medium') || '';
    const referrerUrl = document.referrer || window.location.href;
    
    document.getElementById('utmSource').value = utmSource;
    document.getElementById('utmCampaign').value = utmCampaign;
    document.getElementById('utmMedium').value = utmMedium;
    document.getElementById('referrerUrl').value = referrerUrl;
  }

  handleModalClick(e) {
    if (e.target.id === 'marketingPopupModal') {
      this.closeModal();
    }
  }

  handleFormSubmit(e) {
    // Mark form as completed in localStorage before form submission
    localStorage.setItem('crossroads-marketing-form-completed', 'true');
    
    // Let Netlify handle the form submission naturally
    // The form will redirect to a thank you page or show success message
  }

  handleKeyDown(e) {
    if (e.key === 'Escape') {
      this.closeModal();
    }
  }

  closeModal() {
    this.innerHTML = '';
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.body.style.overflow = '';
  }
}

// Define the custom element
customElements.define('popup-modal', PopupModal);