//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  // Modal functionality for prompt files
  const promptLinks = document.querySelectorAll('.prompt-modal-link')

  if (promptLinks.length > 0) {
    // Create modal overlay and container
    const modalOverlay = document.createElement('div')
    modalOverlay.className = 'prompt-modal-overlay'
    modalOverlay.setAttribute('role', 'dialog')
    modalOverlay.setAttribute('aria-modal', 'true')
    modalOverlay.setAttribute('aria-labelledby', 'modal-title')

    const modalContainer = document.createElement('div')
    modalContainer.className = 'prompt-modal-container'

    const modalHeader = document.createElement('div')
    modalHeader.className = 'prompt-modal-header'

    const modalTitle = document.createElement('h2')
    modalTitle.id = 'modal-title'
    modalTitle.className = 'govuk-heading-m prompt-modal-title'

    const closeButton = document.createElement('button')
    closeButton.className = 'prompt-modal-close'
    closeButton.innerHTML = '&times;'
    closeButton.setAttribute('aria-label', 'Close modal')

    const modalContent = document.createElement('div')
    modalContent.className = 'prompt-modal-content'

    const modalCode = document.createElement('pre')
    modalCode.className = 'prompt-modal-code'

    modalHeader.appendChild(modalTitle)
    modalHeader.appendChild(closeButton)
    modalContent.appendChild(modalCode)
    modalContainer.appendChild(modalHeader)
    modalContainer.appendChild(modalContent)
    modalOverlay.appendChild(modalContainer)
    document.body.appendChild(modalOverlay)

    // Store the previously focused element
    let previouslyFocused = null

    // Function to open modal
    function openModal(promptUrl, promptName) {
      previouslyFocused = document.activeElement
      modalTitle.textContent = promptName
      modalCode.textContent = 'Loading...'
      modalOverlay.style.display = 'flex'
      closeButton.focus()

      // Fetch prompt content
      fetch(promptUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to load prompt')
          }
          return response.text()
        })
        .then(content => {
          modalCode.textContent = content
        })
        .catch(error => {
          modalCode.textContent = 'Error loading prompt file. Please try again.'
          console.error('Error loading prompt:', error)
        })
    }

    // Function to close modal
    function closeModal() {
      modalOverlay.style.display = 'none'
      if (previouslyFocused) {
        previouslyFocused.focus()
      }
    }

    // Add click handlers to prompt links
    promptLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const promptUrl = link.getAttribute('data-prompt')
        const promptName = link.textContent
        openModal(promptUrl, promptName)
      })
    })

    // Close modal on button click
    closeButton.addEventListener('click', closeModal)

    // Close modal on overlay click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal()
      }
    })

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
        closeModal()
      }
    })

    // Trap focus within modal
    modalOverlay.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && modalOverlay.style.display === 'flex') {
        const focusableElements = modalContainer.querySelectorAll('button')
        const firstFocusable = focusableElements[0]
        const lastFocusable = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable.focus()
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable.focus()
        }
      }
    })
  }
})

