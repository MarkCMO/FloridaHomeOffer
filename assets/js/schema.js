/* ============================================
   FloridaHomeOffer - Dynamic Schema Injection
   Reads data attributes from <body> to inject
   correct JSON-LD structured data per page type
   ============================================ */

(function() {
  'use strict';

  var BRAND = 'FloridaHomeOffer';
  var URL = 'https://floridahomeoffer.com';
  var PHONE = '+1-321-555-0199';
  var DESCRIPTION = 'Florida\'s trusted home selling resource. Get a fair cash offer for your home in 24 hours - residential, commercial, land, and more. No agents, no fees, no repairs.';

  function inject(schema) {
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  function buildBreadcrumbs() {
    var crumbs = [{ name: 'Home', url: URL + '/' }];
    var page = document.body.dataset.page || '';
    var title = document.title.split('|')[0].trim();

    if (page && page !== 'home') {
      crumbs.push({ name: title, url: URL + window.location.pathname });
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': crumbs.map(function(c, i) {
        return {
          '@type': 'ListItem',
          'position': i + 1,
          'name': c.name,
          'item': c.url
        };
      })
    };
  }

  function buildOrganization() {
    return {
      '@context': 'https://schema.org',
      '@type': ['RealEstateAgent', 'Organization'],
      'name': BRAND,
      'description': DESCRIPTION,
      'url': URL,
      'telephone': PHONE,
      'areaServed': {
        '@type': 'State',
        'name': 'Florida',
        'containedInPlace': { '@type': 'Country', 'name': 'United States' }
      },
      'address': {
        '@type': 'PostalAddress',
        'addressRegion': 'FL',
        'addressCountry': 'US'
      },
      'priceRange': '$$',
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'reviewCount': '127'
      },
      'sameAs': []
    };
  }

  function buildWebSite() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': BRAND,
      'url': URL,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': URL + '/cities/{search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    };
  }

  function buildFAQPage() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return null;

    var qaPairs = [];
    items.forEach(function(item) {
      var q = item.querySelector('.faq-item__q');
      var a = item.querySelector('.faq-item__a');
      if (q && a) {
        qaPairs.push({
          '@type': 'Question',
          'name': q.textContent.trim(),
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': a.textContent.trim()
          }
        });
      }
    });

    if (!qaPairs.length) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': qaPairs
    };
  }

  function buildArticle() {
    var d = document.body.dataset;
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': d.title || document.title.split('|')[0].trim(),
      'description': d.description || '',
      'author': {
        '@type': 'Person',
        'name': d.author || 'Mark Gabrielli',
        'url': URL + '/about.html'
      },
      'publisher': {
        '@type': 'Organization',
        'name': BRAND,
        'url': URL
      },
      'datePublished': d.datePublished || new Date().toISOString().split('T')[0],
      'dateModified': d.dateModified || new Date().toISOString().split('T')[0],
      'mainEntityOfPage': URL + window.location.pathname
    };
  }

  function buildLocalBusiness() {
    var d = document.body.dataset;
    var city = d.city || '';
    var county = d.county || '';

    return {
      '@context': 'https://schema.org',
      '@type': ['RealEstateAgent', 'LocalBusiness'],
      'name': BRAND + ' - ' + city + ', FL',
      'description': 'Sell your house fast in ' + city + ', Florida. Get a fair cash offer in 24 hours for any property type.',
      'url': URL + window.location.pathname,
      'telephone': PHONE,
      'areaServed': {
        '@type': 'City',
        'name': city,
        'containedInPlace': {
          '@type': 'AdministrativeArea',
          'name': county ? county + ', Florida' : 'Florida'
        }
      },
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': city,
        'addressRegion': 'FL',
        'addressCountry': 'US'
      },
      'priceRange': '$$'
    };
  }

  function buildHowTo() {
    var d = document.body.dataset;
    var steps = document.querySelectorAll('[data-step-name]');
    var stepArr = [];
    steps.forEach(function(el) {
      stepArr.push({
        '@type': 'HowToStep',
        'name': el.dataset.stepName,
        'text': el.dataset.stepText || el.textContent.trim()
      });
    });
    if (!stepArr.length) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      'name': d.title || document.title.split('|')[0].trim(),
      'step': stepArr
    };
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', function() {
    var type = document.body.dataset.schemaType || 'home';

    // Always inject breadcrumbs
    inject(buildBreadcrumbs());

    switch(type) {
      case 'home':
        inject(buildOrganization());
        inject(buildWebSite());
        break;
      case 'faq':
        inject(buildOrganization());
        var faqSchema = buildFAQPage();
        if (faqSchema) inject(faqSchema);
        break;
      case 'article':
        inject(buildArticle());
        var articleFaq = buildFAQPage();
        if (articleFaq) inject(articleFaq);
        break;
      case 'city':
        inject(buildLocalBusiness());
        var cityFaq = buildFAQPage();
        if (cityFaq) inject(cityFaq);
        break;
      case 'howto':
        inject(buildOrganization());
        var howto = buildHowTo();
        if (howto) inject(howto);
        break;
      case 'contact':
        inject(buildOrganization());
        break;
    }
  });
})();
