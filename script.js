// DOM Elements
const leadForm = document.getElementById("leadForm")
const submitBtn = document.querySelector(".cosmic-submit")
const phoneInput = document.getElementById("telefone")
const starsContainer = document.getElementById("starsContainer")

// URL do seu Google Apps Script - ATUALIZADA
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwbH0MBxLfmwMS38w1SNWBolGdphRjzjI5ChJ-5lwmpeYri32Kx1imc_vfQUwR4b4Qc/exec"

// Initialize Universe
document.addEventListener("DOMContentLoaded", () => {
  createStarField()
  initializeAnimations()
  setupFormHandling()
  setupPhoneFormatting()
})

// Create Enhanced Star Field
function createStarField() {
  const numberOfStars = 300 // Aumentado para criar mais estrelas

  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement("div")
    star.className = "star"

    // Distribuição mais realista de tamanhos
    const size = Math.random()
    if (size < 0.7) {
      star.classList.add("small")
    } else if (size < 0.9) {
      star.classList.add("medium")
    } else {
      star.classList.add("large")
    }

    // Mais estrelas coloridas para efeito espacial
    if (Math.random() < 0.4) {
      star.classList.add("colored")
    }

    // Posicionamento aleatório mais natural
    star.style.left = Math.random() * 100 + "%"
    star.style.top = Math.random() * 100 + "%"

    // Variação nas animações
    star.style.animationDelay = Math.random() * 4 + "s"
    star.style.animationDuration = 2 + Math.random() * 4 + "s"

    starsContainer.appendChild(star)
  }

  // Adiciona algumas estrelas cadentes
  createShootingStars()
}

// Nova função para estrelas cadentes
function createShootingStars() {
  setInterval(() => {
    if (Math.random() < 0.3) {
      // 30% de chance a cada intervalo
      const shootingStar = document.createElement("div")
      shootingStar.className = "shooting-star"
      shootingStar.style.left = Math.random() * 100 + "%"
      shootingStar.style.top = Math.random() * 50 + "%"

      starsContainer.appendChild(shootingStar)

      // Remove após animação
      setTimeout(() => {
        if (shootingStar.parentElement) {
          shootingStar.remove()
        }
      }, 3000)
    }
  }, 8000)
}

// Animations
function initializeAnimations() {
  // Parallax effect for cosmic elements
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const cosmicOrbs = document.querySelectorAll(".cosmic-orb")

    cosmicOrbs.forEach((orb, index) => {
      const speed = 0.3 + index * 0.1
      orb.style.transform += ` translateY(${scrolled * speed}px)`
    })
  })

  // Mouse movement effects
  document.addEventListener("mousemove", (e) => {
    const cursor = { x: e.clientX, y: e.clientY }

    // Cosmic text glow effect
    const cosmicElements = document.querySelectorAll(".cosmic-text, .brand-text")

    cosmicElements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const elementCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }

      const distance = Math.sqrt(Math.pow(cursor.x - elementCenter.x, 2) + Math.pow(cursor.y - elementCenter.y, 2))

      const maxDistance = 300
      const intensity = Math.max(0, 1 - distance / maxDistance)

      if (element.classList.contains("cosmic-text")) {
        element.style.filter = `brightness(${1 + intensity * 0.5}) saturate(${1 + intensity * 0.8})`
      }
    })

    // Parallax stars
    const stars = document.querySelectorAll(".star")
    stars.forEach((star, index) => {
      const speed = ((index % 3) + 1) * 0.01
      const x = (cursor.x - window.innerWidth / 2) * speed
      const y = (cursor.y - window.innerHeight / 2) * speed
      star.style.transform = `translate(${x}px, ${y}px)`
    })
  })

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(".hero-content > *, .form-container")
  animateElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
    observer.observe(el)
  })
}

// Form Handling - INTEGRAÇÃO REAL COM GOOGLE APPS SCRIPT
function setupFormHandling() {
  if (leadForm) {
    leadForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Get form data
      const formData = new FormData(leadForm)
      const data = Object.fromEntries(formData)

      // Validate
      if (!validateForm(data)) {
        return
      }

      // Show loading
      setLoadingState(true)

      try {
        // Enviar para Google Apps Script
        await submitLead(data)

        // Success
        showCosmicNotification("🚀 Dominação iniciada! Entraremos em contato em até 2 horas.", "success")
        leadForm.reset()

        // Track conversion
        trackConversion("cosmic_lead_submission", data)

        // Redirect to WhatsApp after 2 seconds
        setTimeout(() => {
          openWhatsApp(
            `🚀 Olá! Acabei de solicitar dominação digital pelo site. Meu nome é ${data.nome} e preciso de ${data.projeto}. Vamos conquistar o universo juntos!`,
          )
        }, 2000)
      } catch (error) {
        console.error("Erro ao enviar formulário:", error)
        showCosmicNotification(
          "❌ Falha na transmissão cósmica. Tente novamente ou entre em contato pelo WhatsApp.",
          "error",
        )
      } finally {
        setLoadingState(false)
      }
    })
  }
}

// Phone Formatting
function setupPhoneFormatting() {
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")

      if (value.length <= 11) {
        if (value.length <= 2) {
          value = value.replace(/(\d{0,2})/, "($1")
        } else if (value.length <= 7) {
          value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2")
        } else {
          value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
        }
      }

      e.target.value = value
    })
  }
}

// Form Validation
function validateForm(data) {
  const requiredFields = ["nome", "email", "telefone", "empresa", "projeto"]
  const missingFields = requiredFields.filter((field) => !data[field] || data[field].trim() === "")

  if (missingFields.length > 0) {
    showCosmicNotification("⚠️ Complete todos os campos para iniciar a dominação.", "error")
    return false
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    showCosmicNotification("⚠️ Insira um e-mail válido para estabelecer comunicação.", "error")
    return false
  }

  // Phone validation
  const phoneRegex = /^$$\d{2}$$\s\d{4,5}-\d{4}$/
  if (!phoneRegex.test(data.telefone)) {
    showCosmicNotification("⚠️ Formato de telefone inválido para transmissão.", "error")
    return false
  }

  return true
}

// Loading State
function setLoadingState(loading) {
  if (submitBtn) {
    submitBtn.classList.toggle("loading", loading)
    submitBtn.disabled = loading

    const btnText = submitBtn.querySelector(".btn-text")
    if (loading) {
      btnText.textContent = "Transmitindo..."
    } else {
      btnText.textContent = "Iniciar Dominação"
    }
  }
}

// FUNÇÃO PRINCIPAL - Integração Real com Google Apps Script
async function submitLead(data) {
  try {
    console.log("🚀 Enviando dados para Google Apps Script:", data)

    // Primeira tentativa: POST com JSON
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      mode: "no-cors", // Necessário para Google Apps Script
    })

    console.log("✅ Dados enviados com sucesso para Google Apps Script!")

    // Como usamos no-cors, assumimos sucesso se não houve erro
    return { success: true }
  } catch (error) {
    console.error("❌ Erro na primeira tentativa, tentando método alternativo:", error)

    try {
      // Segunda tentativa: POST com FormData
      const formData = new FormData()
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key])
      })

      const response2 = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      })

      console.log("✅ Dados enviados com sucesso (método alternativo)!")
      return { success: true }
    } catch (error2) {
      console.error("❌ Erro em ambas as tentativas:", error2)
      throw new Error("Falha na comunicação com o servidor")
    }
  }
}

// Cosmic Notifications
function showCosmicNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".cosmic-notification")
  existingNotifications.forEach((notification) => notification.remove())

  // Create notification
  const notification = document.createElement("div")
  notification.className = `cosmic-notification cosmic-notification-${type}`

  const colors = {
    success: "linear-gradient(135deg, #10B981, #059669)",
    error: "linear-gradient(135deg, #EF4444, #DC2626)",
    info: "linear-gradient(135deg, #3B82F6, #2563EB)",
  }

  notification.innerHTML = `
    <div class="cosmic-notification-content">
      <div class="cosmic-notification-glow"></div>
      <span class="cosmic-notification-message">${message}</span>
      <button class="cosmic-notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `

  // Styles
  notification.style.cssText = `
    position: fixed;
    top: 2rem;
    right: 2rem;
    z-index: 10000;
    max-width: 400px;
    background: ${colors[type]};
    color: white;
    padding: 1.5rem;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    animation: cosmicSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
  `

  // Add styles for animation
  if (!document.getElementById("cosmic-notification-styles")) {
    const style = document.createElement("style")
    style.id = "cosmic-notification-styles"
    style.textContent = `
      @keyframes cosmicSlideIn {
        from {
          transform: translateX(100%) scale(0.8);
          opacity: 0;
        }
        to {
          transform: translateX(0) scale(1);
          opacity: 1;
        }
      }
      .cosmic-notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        position: relative;
      }
      .cosmic-notification-glow {
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
        border-radius: 20px;
        animation: notificationGlow 2s ease-in-out infinite;
        z-index: -1;
      }
      @keyframes notificationGlow {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.05); }
      }
      .cosmic-notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.2s;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
      }
      .cosmic-notification-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.2);
      }
      .cosmic-notification-message {
        flex: 1;
        font-size: 0.875rem;
        line-height: 1.4;
      }
    `
    document.head.appendChild(style)
  }

  document.body.appendChild(notification)

  // Auto remove after 6 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "cosmicSlideIn 0.3s reverse"
      setTimeout(() => notification.remove(), 300)
    }
  }, 6000)
}

// WhatsApp Integration
function openWhatsApp(customMessage = null) {
  const phone = "5511959623000" // Número correto
  const message =
    customMessage || "🚀 Olá! Vi o site da Morientes e quero dominar meu mercado com um site premium que converte!"
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  window.open(url, "_blank")
}

// Analytics Tracking
function trackConversion(eventName, data) {
  // Google Analytics 4
  const gtag = window.gtag
  if (typeof gtag !== "undefined") {
    gtag("event", eventName, {
      custom_parameter: data.projeto,
      value: 5000,
      currency: "BRL",
    })
  }

  // Facebook Pixel
  const fbq = window.fbq
  if (typeof fbq !== "undefined") {
    fbq("track", "Lead", {
      content_category: data.projeto,
      value: 5000,
      currency: "BRL",
    })
  }

  // Console log for debugging
  console.log("🎯 Cosmic conversion tracked:", eventName, data)
}

// Performance Monitoring
window.addEventListener("load", () => {
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
  console.log(`⚡ Universe loaded in ${loadTime}ms`)

  // Track performance
  const gtag = window.gtag
  if (typeof gtag !== "undefined") {
    gtag("event", "cosmic_page_load_time", {
      value: Math.round(loadTime / 1000),
    })
  }
})

// Função de teste para debug (pode ser removida em produção)
function testarFormulario() {
  const dadosTeste = {
    nome: "Teste Morientes",
    email: "teste@morientes.com.br",
    telefone: "(11) 95962-3000",
    empresa: "Morientes Test",
    projeto: "site-novo",
  }

  console.log("🧪 Testando envio de dados...")
  submitLead(dadosTeste)
    .then(() => console.log("✅ Teste concluído com sucesso!"))
    .catch((error) => console.error("❌ Erro no teste:", error))
}

// Para testar no console do navegador, digite: testarFormulario()
