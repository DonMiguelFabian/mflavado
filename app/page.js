'use client'

import { useEffect } from 'react'
import { BI_DATA, MONTHS } from '../lib/data'

export default function Home() {
  useEffect(() => {
    // BI tabs
    function renderChart(key) {
      const data = BI_DATA[key]
      if (!data) return
      const { values, metrics } = data
      const W = 900, H = 280, PAD = 40
      const max = Math.max(...values) * 1.15
      const min = Math.min(...values) * 0.7
      const pts = values.map((v, i) => ({
        x: PAD + (i / (values.length - 1)) * (W - PAD * 2),
        y: H - PAD - ((v - min) / (max - min)) * (H - PAD * 2)
      }))
      const linePath = pts.map((p, i) => (i ? 'L' : 'M') + p.x + ',' + p.y).join(' ')
      const areaPath = linePath + ` L${pts.at(-1).x},${H - PAD} L${pts[0].x},${H - PAD} Z`

      const lineEl = document.getElementById('bi-line')
      const areaEl = document.getElementById('bi-area')
      const dotsEl = document.getElementById('bi-dots')
      const labelsEl = document.getElementById('bi-labels')
      const metricsEl = document.getElementById('bi-metrics')

      if (lineEl) lineEl.setAttribute('d', linePath)
      if (areaEl) areaEl.setAttribute('d', areaPath)
      if (dotsEl) {
        dotsEl.innerHTML = pts.map(p =>
          `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="#d4a84a"/>`
        ).join('')
      }
      if (labelsEl) {
        labelsEl.innerHTML = pts.map((p, i) =>
          `<text x="${p.x}" y="${H - 12}" text-anchor="middle">${MONTHS[i]}</text>`
        ).join('')
      }
      if (metricsEl) {
        metricsEl.innerHTML = metrics.map(m => `
          <div class="bi-metric">
            <div class="lbl">${m.lbl}</div>
            <div class="val">${m.val}</div>
            <div class="delta">${m.delta}</div>
          </div>`
        ).join('')
      }
    }

    renderChart('revenue')

    const tabs = document.querySelectorAll('.bi-tab')
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active')
          t.setAttribute('aria-selected', 'false')
        })
        tab.classList.add('active')
        tab.setAttribute('aria-selected', 'true')
        const panel = document.getElementById('bi-panel')
        if (panel) panel.setAttribute('aria-labelledby', tab.id)
        renderChart(tab.dataset.view)
      })
    })

    // Smooth scroll
    const links = document.querySelectorAll('a[href^="#"]')
    links.forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href')
        if (!href || href === '#') return
        const target = document.querySelector(href)
        if (!target) return
        e.preventDefault()
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })

    // Contact form
    const form = document.getElementById('contact-form')
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault()
        let valid = true

        const fields = [
          { id: 'contact-name',  errId: 'err-name',  test: v => v.trim().length > 1 },
          { id: 'contact-email', errId: 'err-email',  test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
          { id: 'contact-msg',   errId: 'err-msg',    test: v => v.trim().length > 10 }
        ]

        fields.forEach(({ id, errId, test }) => {
          const input = document.getElementById(id)
          const err   = document.getElementById(errId)
          if (!input || !err) return
          const ok = test(input.value)
          err.classList.toggle('visible', !ok)
          input.setAttribute('aria-invalid', ok ? 'false' : 'true')
          if (!ok) valid = false
        })

        const status = document.getElementById('form-status')
        if (!status) return

        if (valid) {
          const btn = form.querySelector('button[type="submit"]')
          if (btn) { btn.disabled = true; btn.textContent = 'Enviando…' }
          setTimeout(() => {
            status.className = 'form-status success'
            status.textContent = '✓ Mensaje enviado. Te respondo en menos de 48 horas.'
            form.reset()
            fields.forEach(({ id }) => {
              const input = document.getElementById(id)
              if (input) input.setAttribute('aria-invalid', 'false')
            })
            if (btn) { btn.disabled = false; btn.textContent = 'Enviar mensaje →' }
          }, 900)
        } else {
          status.className = 'form-status error-msg'
          status.textContent = 'Por favor, revisa los campos marcados.'
          const firstErr = form.querySelector('[aria-invalid="true"]')
          if (firstErr) firstErr.focus()
        }
      })

      // Clear errors on input
      form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
          input.setAttribute('aria-invalid', 'false')
          const errId = 'err-' + input.id.replace('contact-', '').replace('email','email').replace('message','msg').replace('name','name')
          const err = document.getElementById(errId)
          if (err) err.classList.remove('visible')
          const status = document.getElementById('form-status')
          if (status) status.className = 'form-status'
        })
      })
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main-content">Saltar al contenido</a>

      <header className="site-header" role="banner">
        <nav className="nav-inner" aria-label="Navegación principal">
          <a href="#" className="logo" aria-label="MFLavado — Inicio">MFLavado<span aria-hidden="true">.</span></a>
          <ul className="nav-links" role="list">
            <li><a href="#sobre-mi">Sobre mí</a></li>
            <li><a href="#insights">Insights</a></li>
            <li><a href="#tienda">Tienda</a></li>
            <li><a href="#contacto" className="btn-primary nav-cta">Contacto</a></li>
          </ul>
        </nav>
      </header>

      <main id="main-content">

        {/* HERO */}
        <section className="section hero" aria-labelledby="hero-heading">
          <div className="container">
            <p className="hero-eyebrow" aria-hidden="true">Business Intelligence · Strategy · Executive</p>
            <h1 id="hero-heading">
              Estrategia y análisis para decisiones <em className="accent">que importan.</em>
            </h1>
            <p className="hero-sub">
              Consultoría ejecutiva, insights de negocio y recursos prácticos para líderes
              que transforman datos en dirección clara.
            </p>
            <div className="hero-actions">
              <a href="#insights" className="btn btn-primary">Explorar insights →</a>
              <a href="#contacto" className="btn btn-ghost">Hablemos</a>
            </div>

            <ul className="hero-stats" aria-label="Estadísticas clave" role="list">
              <li>
                <div className="stat-num" aria-label="Más de 15 años de experiencia">15+</div>
                <div className="stat-lbl">Años de experiencia</div>
              </li>
              <li>
                <div className="stat-num" aria-label="Más de 40 proyectos">40+</div>
                <div className="stat-lbl">Proyectos ejecutivos</div>
              </li>
              <li>
                <div className="stat-num">12</div>
                <div className="stat-lbl">Sectores cubiertos</div>
              </li>
              <li>
                <div className="stat-num">€100M+</div>
                <div className="stat-lbl">Impacto en decisiones</div>
              </li>
            </ul>
          </div>
        </section>

        {/* ABOUT */}
        <section className="section" id="sobre-mi" aria-labelledby="about-heading">
          <div className="container">
            <p className="section-label" aria-hidden="true">Sobre MFLavado</p>
            <h2 className="section-title" id="about-heading">Traduzco complejidad en claridad ejecutiva.</h2>
            <div className="about-grid">
              <figure className="about-photo" aria-hidden="true">
                <figcaption>Barcelona · Disponible internacionalmente</figcaption>
              </figure>
              <div className="about-content">
                <p>
                  Soy un profesional dedicado a la intersección entre los datos, la estrategia
                  y la toma de decisiones al más alto nivel. Mi trabajo consiste en destilar
                  el ruido de la información en señales accionables para consejos de administración,
                  equipos directivos y emprendedores.
                </p>
                <p>
                  Combino una formación analítica rigurosa con una perspectiva de negocio
                  orientada a resultados. Escribo, analizo y acompaño a organizaciones que
                  quieren tomar decisiones con más contexto y menos intuición ciega.
                </p>
                <dl className="credentials">
                  <div className="credential">
                    <dt>Especialidades</dt>
                    <dd>BI · Estrategia · Finanzas</dd>
                  </div>
                  <div className="credential">
                    <dt>Industrias</dt>
                    <dd>Tech · Retail · Servicios</dd>
                  </div>
                  <div className="credential">
                    <dt>Idiomas</dt>
                    <dd>ES · EN · CA</dd>
                  </div>
                  <div className="credential">
                    <dt>Ubicación</dt>
                    <dd>Barcelona, España</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* INSIGHTS */}
        <section className="section insights" id="insights" aria-labelledby="insights-heading">
          <div className="container">
            <div className="insights-header">
              <div>
                <p className="section-label" aria-hidden="true">Insights & Análisis</p>
                <h2 className="section-title" id="insights-heading">Ideas que cruzan datos y dirección.</h2>
              </div>
              <a href="#" className="btn btn-ghost" aria-label="Ver todos los artículos">Ver todos →</a>
            </div>

            <ul className="insights-grid" role="list">
              {/* Featured */}
              <li>
                <article className="article-card featured" aria-labelledby="art-1-title">
                  <div className="article-thumb">
                    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gráfico de tendencia de ingresos">
                      <rect width="400" height="220" fill="#0e4c5a"/>
                      <path d="M 0 180 Q 100 140,200 130 T 400 80" stroke="#d4a84a" strokeWidth="3" fill="none"/>
                      <path d="M 0 180 Q 100 140,200 130 T 400 80 L 400 220 L 0 220 Z" fill="#d4a84a" opacity="0.15"/>
                      <circle cx="100" cy="155" r="5" fill="#d4a84a"/>
                      <circle cx="200" cy="130" r="5" fill="#d4a84a"/>
                      <circle cx="300" cy="105" r="5" fill="#d4a84a"/>
                      <circle cx="400" cy="80"  r="5" fill="#d4a84a"/>
                      <text x="32" y="50" fill="white" fontFamily="sans-serif" fontSize="13" opacity="0.6">Q1–Q4 Forecast</text>
                    </svg>
                  </div>
                  <div className="article-body">
                    <p className="article-tag">Strategy · Destacado</p>
                    <h3 className="article-title" id="art-1-title">El arte de pronosticar sin adivinar: modelos que los consejos realmente usan</h3>
                    <p className="article-excerpt">Una guía práctica para construir forecasts que no solo predigan, sino que comuniquen incertidumbre y soporten decisiones críticas en la sala del consejo.</p>
                    <footer className="article-meta">
                      <span>12 min lectura</span><span className="dot" aria-hidden="true"></span><time dateTime="2026-04">Abril 2026</time>
                    </footer>
                  </div>
                </article>
              </li>

              <li>
                <article className="article-card" aria-labelledby="art-2-title">
                  <div className="article-thumb">
                    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gráfico de barras">
                      <rect width="400" height="220" fill="#14657a"/>
                      <rect x="60"  y="130" width="40" height="60" fill="#d4a84a"/>
                      <rect x="120" y="100" width="40" height="90" fill="#d4a84a" opacity="0.8"/>
                      <rect x="180" y="70"  width="40" height="120" fill="#d4a84a" opacity="0.7"/>
                      <rect x="240" y="40"  width="40" height="150" fill="#d4a84a" opacity="0.6"/>
                      <rect x="300" y="85"  width="40" height="105" fill="#d4a84a" opacity="0.5"/>
                    </svg>
                  </div>
                  <div className="article-body">
                    <p className="article-tag">BI</p>
                    <h3 className="article-title" id="art-2-title">Cuatro KPIs que todo CEO debería poder explicar en 30 segundos</h3>
                    <footer className="article-meta">
                      <span>6 min</span><span className="dot" aria-hidden="true"></span><time dateTime="2026-03">Marzo 2026</time>
                    </footer>
                  </div>
                </article>
              </li>

              <li>
                <article className="article-card" aria-labelledby="art-3-title">
                  <div className="article-thumb">
                    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gráfico circular">
                      <rect width="400" height="220" fill="#0a0a0a"/>
                      <circle cx="200" cy="110" r="70" fill="none" stroke="#d4a84a" strokeWidth="2"/>
                      <circle cx="200" cy="110" r="70" fill="none" stroke="#d4a84a" strokeWidth="8" strokeDasharray="280 440" strokeDashoffset="-50" transform="rotate(-90 200 110)"/>
                      <text x="200" y="118" fill="white" textAnchor="middle" fontFamily="sans-serif" fontSize="22" fontWeight="600">64%</text>
                    </svg>
                  </div>
                  <div className="article-body">
                    <p className="article-tag">Leadership</p>
                    <h3 className="article-title" id="art-3-title">El sesgo de confirmación en decisiones de inversión</h3>
                    <footer className="article-meta">
                      <span>4 min</span><span className="dot" aria-hidden="true"></span><time dateTime="2026-03">Marzo 2026</time>
                    </footer>
                  </div>
                </article>
              </li>

              <li>
                <article className="article-card" aria-labelledby="art-4-title">
                  <div className="article-thumb">
                    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gráfico de líneas comparativas">
                      <rect width="400" height="220" fill="#0e4c5a"/>
                      <path d="M 40 180 L 120 120 L 200 140 L 280 70 L 360 90" stroke="#fafaf7" strokeWidth="1.5" fill="none" opacity="0.5"/>
                      <path d="M 40 160 L 120 150 L 200 100 L 280 120 L 360 50" stroke="#d4a84a" strokeWidth="2" fill="none"/>
                      <circle cx="40" cy="160" r="3" fill="#d4a84a"/>
                      <circle cx="120" cy="150" r="3" fill="#d4a84a"/>
                      <circle cx="200" cy="100" r="3" fill="#d4a84a"/>
                      <circle cx="280" cy="120" r="3" fill="#d4a84a"/>
                      <circle cx="360" cy="50"  r="3" fill="#d4a84a"/>
                    </svg>
                  </div>
                  <div className="article-body">
                    <p className="article-tag">Análisis</p>
                    <h3 className="article-title" id="art-4-title">Cómo leer un P&amp;L en menos de cinco minutos</h3>
                    <footer className="article-meta">
                      <span>5 min</span><span className="dot" aria-hidden="true"></span><time dateTime="2026-02">Feb 2026</time>
                    </footer>
                  </div>
                </article>
              </li>

              <li>
                <article className="article-card" aria-labelledby="art-5-title">
                  <div className="article-thumb">
                    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama de matriz estratégica">
                      <rect width="400" height="220" fill="#14657a"/>
                      <rect x="100" y="40" width="200" height="140" fill="none" stroke="#d4a84a" strokeWidth="2" rx="8"/>
                      <line x1="100" y1="110" x2="300" y2="110" stroke="#d4a84a" opacity="0.5"/>
                      <line x1="200" y1="40"  x2="200" y2="180" stroke="#d4a84a" opacity="0.5"/>
                      <circle cx="133" cy="73"  r="8" fill="#d4a84a"/>
                      <circle cx="267" cy="147" r="8" fill="#d4a84a"/>
                    </svg>
                  </div>
                  <div className="article-body">
                    <p className="article-tag">Strategy</p>
                    <h3 className="article-title" id="art-5-title">Matrices de decisión: cuándo funcionan y cuándo estorban</h3>
                    <footer className="article-meta">
                      <span>7 min</span><span className="dot" aria-hidden="true"></span><time dateTime="2026-02">Feb 2026</time>
                    </footer>
                  </div>
                </article>
              </li>
            </ul>

            {/* INTERACTIVE BI DEMO */}
            <div className="bi-demo" role="region" aria-label="Dashboard interactivo de ejemplo">
              <div className="bi-header">
                <div>
                  <h3>Dashboard embebido · Ejemplo en vivo</h3>
                  <p>Los artículos pueden incluir visualizaciones interactivas reales, no capturas estáticas.</p>
                </div>
                <div className="bi-tabs" role="tablist" aria-label="Vista del dashboard">
                  <button className="bi-tab active" role="tab" aria-selected="true"  data-view="revenue" id="tab-revenue" aria-controls="bi-panel">Ingresos</button>
                  <button className="bi-tab"        role="tab" aria-selected="false" data-view="margin"  id="tab-margin"  aria-controls="bi-panel">Margen</button>
                  <button className="bi-tab"        role="tab" aria-selected="false" data-view="growth"  id="tab-growth"  aria-controls="bi-panel">Crecimiento</button>
                </div>
              </div>
              <div id="bi-panel" role="tabpanel" aria-labelledby="tab-revenue">
                <div className="bi-chart" aria-hidden="true">
                  <svg id="bi-svg" viewBox="0 0 900 280" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{width:'100%',height:'100%'}}>
                    <g stroke="rgba(255,255,255,0.08)" strokeWidth="1" aria-hidden="true">
                      <line x1="0" y1="50"  x2="900" y2="50"/>
                      <line x1="0" y1="115" x2="900" y2="115"/>
                      <line x1="0" y1="180" x2="900" y2="180"/>
                      <line x1="0" y1="245" x2="900" y2="245"/>
                    </g>
                    <path id="bi-area" d="" fill="rgba(212,168,74,0.15)"/>
                    <path id="bi-line" d="" stroke="#d4a84a" strokeWidth="2.5" fill="none"/>
                    <g id="bi-dots"></g>
                    <g id="bi-labels" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif" fontSize="11"></g>
                  </svg>
                </div>
                <div className="bi-metrics" id="bi-metrics" aria-live="polite"></div>
              </div>
            </div>
          </div>
        </section>

        {/* SHOP */}
        <section className="section" id="tienda" aria-labelledby="shop-heading">
          <div className="container">
            <p className="section-label" aria-hidden="true">Tienda · Próximamente</p>
            <h2 className="section-title" id="shop-heading">Recursos prácticos para ejecutivos y emprendedores.</h2>
            <p className="section-desc">Cursos, libros y plantillas para acelerar tu curva de aprendizaje en estrategia, análisis y liderazgo basado en datos.</p>

            <ul className="shop-grid" role="list">
              <li>
                <article className="product-card" aria-labelledby="prod-1-title">
                  <div className="product-img">
                    <span className="product-badge" aria-label="Disponible próximamente">Próximamente</span>
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Icono de libro">
                      <rect x="20" y="15" width="60" height="75" rx="3" fill="#0e4c5a"/>
                      <rect x="25" y="22" width="50" height="2" fill="#d4a84a"/>
                      <rect x="25" y="30" width="40" height="1.5" fill="#fafaf7" opacity="0.6"/>
                      <rect x="25" y="36" width="45" height="1.5" fill="#fafaf7" opacity="0.6"/>
                      <rect x="25" y="42" width="35" height="1.5" fill="#fafaf7" opacity="0.6"/>
                    </svg>
                  </div>
                  <div className="product-body">
                    <p className="product-cat">Libro</p>
                    <h3 className="product-title" id="prod-1-title">Decisiones ejecutivas en la era de los datos</h3>
                    <p className="product-desc">Un manual práctico para líderes que quieren decidir con rigor sin perder intuición.</p>
                    <div className="product-foot">
                      <span className="product-price">€29</span>
                      <button className="product-notify" aria-label="Notifícame cuando esté disponible: Libro">Notifícame →</button>
                    </div>
                  </div>
                </article>
              </li>

              <li>
                <article className="product-card" aria-labelledby="prod-2-title">
                  <div className="product-img">
                    <span className="product-badge" aria-label="Disponible próximamente">Próximamente</span>
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Icono de curso en vídeo">
                      <circle cx="50" cy="50" r="35" fill="#0e4c5a"/>
                      <polygon points="42,38 42,62 62,50" fill="#d4a84a"/>
                    </svg>
                  </div>
                  <div className="product-body">
                    <p className="product-cat">Curso online</p>
                    <h3 className="product-title" id="prod-2-title">BI para no analistas: del dato a la decisión</h3>
                    <p className="product-desc">8 módulos para dominar los fundamentos del análisis de negocio sin background técnico.</p>
                    <div className="product-foot">
                      <span className="product-price">€249</span>
                      <button className="product-notify" aria-label="Notifícame cuando esté disponible: Curso">Notifícame →</button>
                    </div>
                  </div>
                </article>
              </li>

              <li>
                <article className="product-card" aria-labelledby="prod-3-title">
                  <div className="product-img">
                    <span className="product-badge" aria-label="Disponible próximamente">Próximamente</span>
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Icono de plantillas">
                      <rect x="20" y="25" width="60" height="50" rx="3" fill="#0e4c5a"/>
                      <rect x="27" y="35" width="20" height="12" fill="#d4a84a"/>
                      <rect x="53" y="35" width="20" height="12" fill="#d4a84a" opacity="0.6"/>
                      <rect x="27" y="53" width="20" height="12" fill="#d4a84a" opacity="0.6"/>
                      <rect x="53" y="53" width="20" height="12" fill="#d4a84a"/>
                    </svg>
                  </div>
                  <div className="product-body">
                    <p className="product-cat">Plantillas</p>
                    <h3 className="product-title" id="prod-3-title">Pack estratégico: dashboards y frameworks</h3>
                    <p className="product-desc">15 plantillas listas para usar en Notion, Excel y Figma. Probadas en proyectos reales.</p>
                    <div className="product-foot">
                      <span className="product-price">€79</span>
                      <button className="product-notify" aria-label="Notifícame cuando esté disponible: Plantillas">Notifícame →</button>
                    </div>
                  </div>
                </article>
              </li>
            </ul>
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact-section" id="contacto" aria-labelledby="contact-heading">
          <div className="container">
            <p className="section-label" aria-hidden="true">Hablemos</p>
            <h2 className="section-title" id="contact-heading">¿Tienes un reto estratégico por delante?</h2>
            <p className="section-desc" style={{color:'rgba(255,255,255,0.75)',marginBottom:'var(--sp-2xl)'}}>
              Colaboro con equipos directivos, consejos y emprendedores en proyectos de estrategia, análisis y transformación basada en datos.
            </p>

            <div className="contact-grid">
              <form className="contact-form" id="contact-form" noValidate aria-label="Formulario de contacto">
                <div className="form-group">
                  <label htmlFor="contact-name">Nombre</label>
                  <input id="contact-name" name="name" type="text" placeholder="Tu nombre" autoComplete="name" aria-required="true"/>
                  <span className="field-error" id="err-name" role="alert">Por favor, introduce tu nombre.</span>
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">Email</label>
                  <input id="contact-email" name="email" type="email" placeholder="tu@email.com" autoComplete="email" aria-required="true"/>
                  <span className="field-error" id="err-email" role="alert">Introduce un email válido.</span>
                </div>
                <div className="form-group">
                  <label htmlFor="contact-company">Empresa <span style={{opacity:'0.6',fontWeight:'400'}}>(opcional)</span></label>
                  <input id="contact-company" name="company" type="text" placeholder="Tu empresa" autoComplete="organization"/>
                </div>
                <div className="form-group">
                  <label htmlFor="contact-msg">Cuéntame tu proyecto</label>
                  <textarea id="contact-msg" name="message" placeholder="Describe brevemente en qué estás trabajando..." aria-required="true"></textarea>
                  <span className="field-error" id="err-msg" role="alert">Por favor, escribe tu mensaje.</span>
                </div>
                <button type="submit" className="btn btn-gold" aria-label="Enviar mensaje de contacto">Enviar mensaje →</button>
                <div className="form-status" id="form-status" role="status" aria-live="polite"></div>
              </form>

              <div className="contact-info">
                <h4>También me encuentras en:</h4>
                <p>Respondo personalmente todos los mensajes en un plazo máximo de 48 horas.</p>
                <dl className="contact-list">
                  <div style={{display:'flex',justifyContent:'space-between',padding:'var(--sp-sm) 0',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                    <dt style={{fontFamily:'ui-sans-serif,system-ui,sans-serif',fontSize:'var(--fs-xs)',color:'var(--gold-soft)',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:'600'}}>Email</dt>
                    <dd><a href="mailto:hola@mflavado.com" aria-label="Enviar email a hola@mflavado.com">hola@mflavado.com</a></dd>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',padding:'var(--sp-sm) 0',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                    <dt style={{fontFamily:'ui-sans-serif,system-ui,sans-serif',fontSize:'var(--fs-xs)',color:'var(--gold-soft)',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:'600'}}>LinkedIn</dt>
                    <dd><a href="#" aria-label="Perfil de LinkedIn de MFLavado">/in/mflavado</a></dd>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',padding:'var(--sp-sm) 0',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                    <dt style={{fontFamily:'ui-sans-serif,system-ui,sans-serif',fontSize:'var(--fs-xs)',color:'var(--gold-soft)',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:'600'}}>Newsletter</dt>
                    <dd><a href="#" aria-label="Suscribirse a la newsletter">insights.mflavado.com</a></dd>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',padding:'var(--sp-sm) 0'}}>
                    <dt style={{fontFamily:'ui-sans-serif,system-ui,sans-serif',fontSize:'var(--fs-xs)',color:'var(--gold-soft)',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:'600'}}>Ubicación</dt>
                    <dd>Barcelona, España</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="site-footer" role="contentinfo">
        <div className="container">
          <div className="footer-inner">
            <p className="footer-copy">© 2026 MFLavado · Todos los derechos reservados</p>
            <nav aria-label="Navegación del pie de página">
              <ul className="footer-links" role="list">
                <li><a href="#">Aviso legal</a></li>
                <li><a href="#">Privacidad</a></li>
                <li><a href="#">Cookies</a></li>
                <li><a href="#">RSS</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </>
  )
}