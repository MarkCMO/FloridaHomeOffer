/* ============================================
   FloridaHomeOffer - Lead Form Component
   Reusable form injected on all pages
   ============================================ */

(function() {
  'use strict';

  var FLORIDA_CITIES = [
    'Miami','Orlando','Tampa','Jacksonville','Fort Lauderdale','St. Petersburg',
    'Cape Coral','Fort Myers','Naples','Sarasota','Clearwater','West Palm Beach',
    'Boca Raton','Hollywood','Kissimmee','Daytona Beach','Melbourne','Palm Bay',
    'Titusville','Cape Canaveral','Cocoa Beach','Merritt Island','Gainesville',
    'Tallahassee','Pensacola','Lakeland','Deltona','Ocala','Bradenton',
    'Port Charlotte','Sanford','Plant City','Hialeah','Homestead','Doral',
    'Plantation','Davie','Sunrise','Coral Springs','Pompano Beach',
    'Delray Beach','Boynton Beach','Winter Park','Altamonte Springs',
    'Clermont','Winter Haven','Largo','Brandon','Wesley Chapel','Riverview',
    'Rockledge','Satellite Beach','Viera','St. Augustine'
  ].sort();

  var PROPERTY_TYPES = [
    { value: 'single-family', label: 'Single-Family Home' },
    { value: 'condo', label: 'Condo / Townhouse' },
    { value: 'multi-family', label: 'Multi-Family (2-4 Units)' },
    { value: 'apartment', label: 'Apartment Building (5+ Units)' },
    { value: 'commercial', label: 'Commercial Property' },
    { value: 'retail', label: 'Retail / Office Space' },
    { value: 'warehouse', label: 'Warehouse / Industrial' },
    { value: 'vacant-land', label: 'Vacant Land' },
    { value: 'mobile-home', label: 'Mobile / Manufactured Home' },
    { value: 'farm-ranch', label: 'Farm / Ranch' },
    { value: 'mixed-use', label: 'Mixed-Use Property' },
    { value: 'other', label: 'Other' }
  ];

  var CONDITIONS = [
    { value: 'excellent', label: 'Excellent - Move-In Ready' },
    { value: 'good', label: 'Good - Minor Cosmetic Updates' },
    { value: 'fair', label: 'Fair - Needs Some Repairs' },
    { value: 'poor', label: 'Poor - Major Repairs Needed' },
    { value: 'as-is', label: 'As-Is / Distressed' }
  ];

  var TIMEFRAMES = [
    { value: 'asap', label: 'ASAP - As Fast as Possible' },
    { value: '1-3-months', label: '1 - 3 Months' },
    { value: '3-6-months', label: '3 - 6 Months' },
    { value: 'exploring', label: 'Just Exploring Options' }
  ];

  function getUTM(param) {
    try {
      return new URLSearchParams(window.location.search).get(param) || '';
    } catch(e) { return ''; }
  }

  function buildOptions(arr, placeholder) {
    var html = '<option value="">' + placeholder + '</option>';
    arr.forEach(function(item) {
      if (typeof item === 'string') {
        html += '<option value="' + item + '">' + item + '</option>';
      } else {
        html += '<option value="' + item.value + '">' + item.label + '</option>';
      }
    });
    return html;
  }

  window.injectLeadForm = function(containerId, options) {
    options = options || {};
    var container = document.getElementById(containerId);
    if (!container) return;

    var heading = options.heading || 'Get Your Free Cash Offer';
    var subtext = options.subtext || 'No fees. No agents. No obligation. Close in as little as 7 days.';
    var compact = options.compact || false;
    var showPropertyType = options.showPropertyType !== false;

    var html = '<div class="lead-form-wrap">';
    html += '<h3>' + heading + '</h3>';
    html += '<p class="form-sub">' + subtext + '</p>';
    html += '<form id="lead-form-' + containerId + '" class="lead-form" novalidate>';

    // Row 1: Name + Phone
    html += '<div class="form-row">';
    html += '<div class="form-group"><label for="lf-name-' + containerId + '">Full Name *</label>';
    html += '<input type="text" id="lf-name-' + containerId + '" name="name" placeholder="John Smith" required></div>';
    html += '<div class="form-group"><label for="lf-phone-' + containerId + '">Phone Number *</label>';
    html += '<input type="tel" id="lf-phone-' + containerId + '" name="phone" placeholder="(555) 555-5555" required></div>';
    html += '</div>';

    // Row 2: Email + City
    html += '<div class="form-row">';
    html += '<div class="form-group"><label for="lf-email-' + containerId + '">Email Address *</label>';
    html += '<input type="email" id="lf-email-' + containerId + '" name="email" placeholder="you@email.com" required></div>';
    html += '<div class="form-group"><label for="lf-city-' + containerId + '">City</label>';
    html += '<select id="lf-city-' + containerId + '" name="city">' + buildOptions(FLORIDA_CITIES, 'Select City') + '<option value="other">Other</option></select></div>';
    html += '</div>';

    // Row 3: Address
    html += '<div class="form-row form-row--single">';
    html += '<div class="form-group"><label for="lf-address-' + containerId + '">Property Address *</label>';
    html += '<input type="text" id="lf-address-' + containerId + '" name="address" placeholder="123 Main St, City, FL 32xxx" required></div>';
    html += '</div>';

    // Row 4: Property Type + Condition
    if (showPropertyType) {
      html += '<div class="form-row">';
      html += '<div class="form-group"><label for="lf-type-' + containerId + '">Property Type</label>';
      html += '<select id="lf-type-' + containerId + '" name="property_type">' + buildOptions(PROPERTY_TYPES, 'Select Type') + '</select></div>';
      html += '<div class="form-group"><label for="lf-cond-' + containerId + '">Property Condition</label>';
      html += '<select id="lf-cond-' + containerId + '" name="property_condition">' + buildOptions(CONDITIONS, 'Select Condition') + '</select></div>';
      html += '</div>';
    }

    // Row 5: Timeframe
    html += '<div class="form-row form-row--single">';
    html += '<div class="form-group"><label for="lf-time-' + containerId + '">How Soon Do You Need to Sell?</label>';
    html += '<select id="lf-time-' + containerId + '" name="timeframe">' + buildOptions(TIMEFRAMES, 'Select Timeframe') + '</select></div>';
    html += '</div>';

    // Message (not on compact)
    if (!compact) {
      html += '<div class="form-row form-row--single">';
      html += '<div class="form-group"><label for="lf-msg-' + containerId + '">Additional Details (Optional)</label>';
      html += '<textarea id="lf-msg-' + containerId + '" name="message" placeholder="Tell us about your property or situation..."></textarea></div>';
      html += '</div>';
    }

    // Hidden UTM fields
    html += '<input type="hidden" name="utm_source" value="' + getUTM('utm_source') + '">';
    html += '<input type="hidden" name="utm_medium" value="' + getUTM('utm_medium') + '">';
    html += '<input type="hidden" name="utm_campaign" value="' + getUTM('utm_campaign') + '">';
    html += '<input type="hidden" name="landing_page" value="' + window.location.href + '">';
    html += '<input type="hidden" name="referrer" value="' + (document.referrer || '') + '">';
    html += '<input type="hidden" name="source_page" value="' + (document.body.dataset.page || '') + '">';

    // Submit
    html += '<div class="form-submit"><button type="submit" class="btn btn--primary btn--large">Get My Cash Offer</button></div>';
    html += '<p class="form-privacy">Your information is 100% confidential. We never share or sell your data.</p>';
    html += '<div id="form-msg-' + containerId + '"></div>';
    html += '</form>';
    html += '</div>';

    container.innerHTML = html;

    // Phone formatting
    var phoneInput = document.getElementById('lf-phone-' + containerId);
    if (phoneInput) {
      phoneInput.addEventListener('input', function() {
        var val = this.value.replace(/\D/g, '');
        if (val.length >= 7) {
          this.value = '(' + val.slice(0,3) + ') ' + val.slice(3,6) + '-' + val.slice(6,10);
        } else if (val.length >= 4) {
          this.value = '(' + val.slice(0,3) + ') ' + val.slice(3);
        }
      });
    }

    // Form submission
    var form = document.getElementById('lead-form-' + containerId);
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var msgEl = document.getElementById('form-msg-' + containerId);

      // Clear errors
      form.querySelectorAll('.form-group--error').forEach(function(g) { g.classList.remove('form-group--error'); });
      form.querySelectorAll('.form-error').forEach(function(e) { e.remove(); });
      msgEl.innerHTML = '';

      // Validate
      var data = {};
      var valid = true;
      var inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(function(inp) {
        data[inp.name] = inp.value.trim();
      });

      if (!data.name) { showError(form, 'name', 'Name is required'); valid = false; }
      if (!data.phone || data.phone.replace(/\D/g,'').length < 10) { showError(form, 'phone', 'Valid phone number required'); valid = false; }
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { showError(form, 'email', 'Valid email required'); valid = false; }
      if (!data.address) { showError(form, 'address', 'Property address is required'); valid = false; }

      if (!valid) return;

      // Submit
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Submitting...';

      fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function(res) { return res.json(); })
      .then(function(json) {
        if (json.success) {
          window.location.href = '/thank-you.html';
        } else {
          msgEl.innerHTML = '<p class="form-error" style="text-align:center;margin-top:12px;">Something went wrong. Please call us directly.</p>';
          btn.disabled = false;
          btn.textContent = 'Get My Cash Offer';
        }
      })
      .catch(function() {
        msgEl.innerHTML = '<p class="form-error" style="text-align:center;margin-top:12px;">Network error. Please try again or call us.</p>';
        btn.disabled = false;
        btn.textContent = 'Get My Cash Offer';
      });
    });
  };

  function showError(form, name, msg) {
    var input = form.querySelector('[name="' + name + '"]');
    if (!input) return;
    var group = input.closest('.form-group');
    if (group) {
      group.classList.add('form-group--error');
      var err = document.createElement('span');
      err.className = 'form-error';
      err.textContent = msg;
      group.appendChild(err);
    }
  }
})();
