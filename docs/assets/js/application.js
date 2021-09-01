/* eslint-env browser */

/* global ClipboardJS: false, bootstrap: false */

(function () {
  'use strict'

  var btnHtml = '<div class="bd-clipboard"><button type="button" class="btn-clipboard" title="Copy to clipboard"><svg class="bi" width="1em" height="1em" fill="currentColor"><use xlink:href="/bootstrap-icons.svg#clipboard"/></svg></button></div>';

  [].slice.call(document.querySelectorAll('div.highlight'))
    .forEach(function (element) {
      element.insertAdjacentHTML('beforebegin', btnHtml)
    })

  document.querySelectorAll('.btn-clipboard')
    .forEach(function (btn) {
      var tooltipBtn = new bootstrap.Tooltip(btn)

      btn.addEventListener('mouseleave', function () {
        // Explicitly hide tooltip, since after clicking it remains
        // focused (as it's a button), so tooltip would otherwise
        // remain visible until focus is moved away
        tooltipBtn.hide()
      })
    })

  var clipboard = new ClipboardJS('.btn-clipboard', {
    target: function (trigger) {
      return trigger.parentNode.nextElementSibling
    }
  })

  clipboard.on('success', function (event) {
    var iconFirstChild = event.trigger.querySelector('.bi').firstChild
    var namespace = 'http://www.w3.org/1999/xlink'
    var originalXhref = iconFirstChild.getAttributeNS(namespace, 'href')
    //var originalTitle = event.trigger.title

    //event.clearSelection()
    iconFirstChild.setAttributeNS(namespace, 'href', originalXhref.replace('clipboard', 'check2'))
    //event.trigger.title = "Copied!"

    var tooltipBtn = bootstrap.Tooltip.getInstance(event.trigger)

    event.trigger.setAttribute('data-bs-original-title', 'Copied!')
    tooltipBtn.show()

    //event.trigger.setAttribute('data-bs-original-title', 'Copy to clipboard')
    event.clearSelection()

    setTimeout(function () {
      iconFirstChild.setAttributeNS(namespace, 'href', originalXhref)
      //event.trigger.title = originalTitle
      event.trigger.setAttribute('data-bs-original-title', 'Copy to clipboard')
      tooltipBtn.hide()
    }, 2000)
  })

  clipboard.on('error', function (event) {
    var modifierKey = /mac/i.test(navigator.userAgent) ? '\u2318' : 'Ctrl-'
    var fallbackMsg = 'Press ' + modifierKey + 'C to copy'
    var tooltipBtn = bootstrap.Tooltip.getInstance(event.trigger)

    event.trigger.setAttribute('data-bs-original-title', fallbackMsg)
    tooltipBtn.show()

    event.trigger.setAttribute('data-bs-original-title', 'Copy to clipboard')
  });

  // Disable empty links in docs
  [].slice.call(document.querySelectorAll('[href="#"]'))
    .forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault()
      })
    })
})()
