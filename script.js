// ===== MORIENTES DIGITAL SUPREMACY - FORM HANDLER =====
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all modules
  StarField.init()
  Animations.init()
  Forms.init()
  PhoneFormatter.init()
})

// ===== STAR FIELD MODULE =====
const StarField = {
  init() {
    this.createStarField()
    this.createShootingStars()
  },

  createStarField() {
    const starsContainer = document.getElementById("starsContainer")
    if (!starsContainer) return

    const numberOfStars = 300
    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement("div")
      star.className = "star"
      const size = Math.random()
      star.classList.add(size < 0.7 ? "small" : size < 0.9 ? "medium" : "large")
      if (Math.random() < 0.4) star.classList.add("colored")
      star.style.left = Math.random() * 100 + "%"
      star.style.top = Math.random() * 100 + "%"
      star.style.animationDelay = Math.random() * 4 + "s"
      star.style.animationDuration = 2 + Math.random() * 4 + "s"
      starsContainer.appendChild(star)
    }
  },

  createShootingStars() {
    const starsContainer = document.getElementById("starsContainer")
    if (!starsContainer) return

    setInterval(() => {
      if (Math.random() < 0.3) {
        const shootingStar = document.createElement("div")
        shootingStar.className = "shooting-star"
        shootingStar.style.left = Math.random() * 100 + "%"
        shootingStar.style.top = Math.random() * 50 + "%"
        starsContainer.appendChild(shootingStar)
        setTimeout(() => shootingStar.remove(), 3000)
      }
    }, 8000)
  },
}

// ===== ANIMATIONS MODULE =====
const Animations = {
  init() {
    this.setupScrollAnimations()
    this.setupMouseEffects()
    this.setupIntersectionObserver()
  },

  setupScrollAnimations() {
    window.addEventListener(
      "scroll",
      this.throttle(() => {
        const scrolled = window.pageYOffset
        document.querySelectorAll(".cosmic-orb").forEach((orb, i) => {
          orb.style.transform += ` translateY(${scrolled * (0.3 + i * 0.1)}px)`
        })
      }, 16),
      { passive: true },
    )
  },

  setupMouseEffects() {
    document.addEventListener("mousemove", (e) => {
      const cursor = { x: e.clientX, y: e.clientY }
      const maxDistance = 300

      document.querySelectorAll(".cosmic-text, .brand-text").forEach((el) => {
        const rect = el.getBoundingClientRect()
        const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        const distance = Math.hypot(cursor.x - center.x, cursor.y - center.y)
        const intensity = Math.max(0, 1 - distance / maxDistance)
        el.style.filter = `brightness(${1 + intensity * 0.5}) saturate(${1 + intensity * 0.8})`
      })

      document.querySelectorAll(".star").forEach((star, i) => {
        const speed = ((i % 3) + 1) * 0.01
        star.style.transform = `translate(${(cursor.x - window.innerWidth / 2) * speed}px, ${(cursor.y - window.innerHeight / 2) * speed}px)`
      })
    })
  },

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    document.querySelectorAll(".hero-content > *, .form-container").forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
      observer.observe(el)
    })
  },

  throttle(func, limit) {
    let inThrottle
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },
}

// ===== PHONE FORMATTER MODULE =====
const PhoneFormatter = {
  init() {
    const phoneInput = document.getElementById("telefone")
    if (!phoneInput) return

    phoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")

      // Limitar a 11 dígitos
      if (value.length > 11) {
        value = value.substring(0, 11)
      }

      // Aplicar máscara
      if (value.length <= 2) {
        value = value.replace(/(\d{0,2})/, "($1")
      } else if (value.length <= 7) {
        value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2")
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
      }

      e.target.value = value
    })

    // Adicionar evento para prevenir caracteres inválidos
    phoneInput.addEventListener("keypress", (e) => {
      // Permitir apenas números, backspace, delete, tab, escape, enter
      const allowedKeys = [8, 9, 27, 13, 46]
      const isNumber = (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)

      if (!allowedKeys.includes(e.keyCode) && !isNumber) {
        e.preventDefault()
      }
    })
  },
}

// ===== FORMS MODULE =====
const Forms = {
  init() {
    this.setupContactForm()
    this.setupFormValidation()
  },

  setupContactForm() {
    const form = document.getElementById("leadForm")
    if (!form) return

    form.addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleContactSubmit(form)
    })
  },

  setupFormValidation() {
    const inputs = document.querySelectorAll("input, textarea, select")

    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateField(input)
      })

      input.addEventListener("input", () => {
        this.clearFieldError(input)
      })

      input.addEventListener("change", () => {
        this.clearFieldError(input)
      })
    })
  },

  validateField(field) {
    const isValid = field.checkValidity() && field.value.trim() !== ""

    if (!isValid && field.hasAttribute("required")) {
      field.style.borderColor = "#dc2626"
      field.style.boxShadow = "0 0 0 3px rgba(220, 38, 38, 0.1)"
    } else {
      field.style.borderColor = ""
      field.style.boxShadow = ""
    }

    return isValid
  },

  clearFieldError(field) {
    field.style.borderColor = ""
    field.style.boxShadow = ""
  },

  handleContactSubmit(form) {
    // Capturar dados de forma mais robusta
    const nomeEl = document.getElementById("nome")
    const emailEl = document.getElementById("email")
    const telefoneEl = document.getElementById("telefone")
    const empresaEl = document.getElementById("empresa")
    const projetoEl = document.getElementById("projeto")

    const data = {
      nome: nomeEl ? nomeEl.value.trim() : "",
      email: emailEl ? emailEl.value.trim() : "",
      telefone: telefoneEl ? telefoneEl.value.trim() : "",
      empresa: empresaEl ? empresaEl.value.trim() : "",
      projeto: projetoEl ? projetoEl.value.trim() : "",
    }

    console.log("📝 Dados capturados do formulário:", data)
    console.log("📝 Elementos encontrados:", {
      nome: !!nomeEl,
      email: !!emailEl,
      telefone: !!telefoneEl,
      empresa: !!empresaEl,
      projeto: !!projetoEl,
    })

    if (!this.validateForm(data)) {
      return
    }

    this.submitContact(data)
  },

  validateForm(data) {
    const requiredFields = ["nome", "email", "telefone", "empresa", "projeto"]
    const missing = []

    // Verificar cada campo individualmente
    requiredFields.forEach((field) => {
      if (!data[field] || data[field] === "" || data[field] === "Escolha sua arma") {
        missing.push(field)
      }
    })

    console.log("🔍 Campos faltando:", missing)
    console.log("🔍 Dados para validação:", data)

    if (missing.length > 0) {
      const fieldNames = {
        nome: "Nome",
        email: "E-mail",
        telefone: "Telefone",
        empresa: "Empresa",
        projeto: "Tipo de Projeto",
      }

      const missingNames = missing.map((field) => fieldNames[field]).join(", ")
      this.showCosmicNotification(`⚠️ Complete os campos: ${missingNames}`, "error")
      return false
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      this.showCosmicNotification("⚠️ Insira um e-mail válido para estabelecer comunicação.", "error")
      return false
    }

    // Validação de telefone - SIMPLIFICADA
    const phoneClean = data.telefone.replace(/\D/g, "")
    if (phoneClean.length < 10 || phoneClean.length > 11) {
      this.showCosmicNotification("⚠️ Insira um telefone válido com DDD.", "error")
      return false
    }

    return true
  },

  async submitContact(data) {
    try {
      const submitBtn = document.querySelector(".cosmic-submit")
      const btnText = submitBtn.querySelector(".btn-text")

      // Estado de loading
      const originalHTML = btnText.textContent
      btnText.textContent = "Transmitindo..."
      submitBtn.disabled = true
      submitBtn.classList.add("loading")

      // URL do Google Apps Script - SUBSTITUA PELA SUA URL
      const SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbxkI5Ja7fPNqdJJcdlCvOlVxcus4ua6F6TLhEgAaJY8EYrORuQzSRKX8pEgxEW-6ilI/exec"

      // Preparar dados para envio
      const formData = {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        empresa: data.empresa,
        projeto: data.projeto,
      }

      console.log("🚀 Enviando dados para Google Apps Script:", formData)

      // Enviar para Google Apps Script
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Importante para Google Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      // Como usamos no-cors, sempre assumimos sucesso se não houver erro
      console.log("✅ Dados enviados para planilha com sucesso")

      // Resetar formulário
      document.getElementById("leadForm").reset()

      // Mostrar mensagem de sucesso
      this.showCosmicNotification("🚀 Dominação iniciada! Entraremos em contato em até 2 horas.", "success")

      // Restaurar botão
      btnText.textContent = originalHTML
      submitBtn.disabled = false
      submitBtn.classList.remove("loading")

      // Track conversion
      this.trackConversion("cosmic_lead_submission", data)
    } catch (error) {
      console.error("❌ Erro ao enviar:", error)

      this.showCosmicNotification(
        "❌ Falha na transmissão cósmica. Tente novamente ou entre em contato pelo WhatsApp.",
        "error",
      )

      // Restaurar botão
      const submitBtn = document.querySelector(".cosmic-submit")
      const btnText = submitBtn.querySelector(".btn-text")
      btnText.textContent = "Iniciar Dominação"
      submitBtn.disabled = false
      submitBtn.classList.remove("loading")
    }
  },

  showCosmicNotification(message, type = "info") {
    // Remove notificações existentes
    const existing = document.querySelectorAll(".cosmic-notification")
    existing.forEach((n) => n.remove())

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
      animation: cosmicSlideIn 0.5s ease;
      font-weight: 500;
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(20px);
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = "cosmicSlideIn 0.3s reverse"
        setTimeout(() => notification.remove(), 300)
      }
    }, 6000)
  },

  trackConversion(eventName, data) {
    // Google Analytics
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", eventName, {
        custom_parameter: data.projeto,
        value: 5000,
        currency: "BRL",
      })
    }

    // Facebook Pixel
    if (typeof window.fbq !== "undefined") {
      window.fbq("track", "Lead", {
        content_category: data.projeto,
        value: 5000,
        currency: "BRL",
      })
    }

    console.log("🎯 Cosmic conversion tracked:", eventName, data)
  },
}

// ===== WHATSAPP FUNCTION =====
function openWhatsApp() {
  const message = encodeURIComponent(
    "Olá! Vim através do site e gostaria de saber mais sobre os serviços da Morientes.",
  )
  const whatsappURL = `https://wa.me/5511959623000?text=${message}`
  window.open(whatsappURL, "_blank")
}

// ===== CSS ANIMATIONS =====
const style = document.createElement("style")
style.textContent = `
@keyframes cosmicSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.loading .btn-text::after {
  content: "";
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 0.5rem;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
`
document.head.appendChild(style)

// ===== PERFORMANCE MONITORING =====
window.addEventListener("load", () => {
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
  console.log(`⚡ Universe loaded in ${loadTime}ms`)
})

// ===== ERROR HANDLING =====
window.addEventListener("error", (e) => {
  console.error("JavaScript Error:", e.error)
})

window.addEventListener("unhandledrejection", (e) => {
  console.error("Promise Rejection:", e.reason)
})
