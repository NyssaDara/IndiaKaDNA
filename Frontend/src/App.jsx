import { useState } from 'react'
import {
  Routes, Route, Link, NavLink, useNavigate
} from 'react-router-dom'
import {
  ArrowRight, Camera, Compass, BookOpen, MapPin,
  Eye, EyeOff, Menu, X, Sparkles, Upload,
  ClipboardCheck, Lightbulb, Landmark, Search
} from 'lucide-react'
import HeritageScene from './HeritageScene.jsx'
import './App.css'

const photos = [
  {
    src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900',
    name: 'Taj Mahal',
    place: 'Agra, Uttar Pradesh'
  },
  {
    src: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900',
    name: 'The Colours of Rajasthan',
    place: 'Rajasthan'
  },
  {
    src: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900',
    name: 'Indian Architecture',
    place: 'India'
  },
  {
    src: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=900',
    name: 'Heritage and Tradition',
    place: 'India'
  },
  {
    src: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=900',
    name: 'Sacred Spaces',
    place: 'India'
  }
]

function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    ['/explore', 'Explore'],
    ['/stories', 'Stories'],
    ['/map', 'India Map'],
    ['/contribute', 'Contribute']
  ]

  return (
    <nav className="navbar">
      <Link to="/" className="brand" onClick={() => setOpen(false)}>
        INDIA<span>KA</span>DNA<span className="brand-dot">.</span>
      </Link>

      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <X /> : <Menu />}
      </button>

      <div className={`nav-links ${open ? 'show' : ''}`}>
        {links.map(([path, label]) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setOpen(false)}
          >
            {label}
          </NavLink>
        ))}
        <Link
          to="/login"
          className="nav-login"
          onClick={() => setOpen(false)}
        >
          Log in ↗
        </Link>
      </div>
    </nav>
  )
}

function PhotoStrip({ reverse = false }) {
  const images = [...photos, ...photos]

  return (
    <div className={`photo-strip ${reverse ? 'reverse' : ''}`}>
      <div className="photo-track">
        {images.map((photo, index) => (
          <div className="strip-card" key={`${photo.name}-${index}`}>
            <img
              src={photo.src}
              alt={photo.name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.visibility = 'hidden'
              }}
            />
            <div className="strip-caption">
              <span>{photo.name}</span>
              <small>{photo.place}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChoiceCard({ icon: Icon, title, description, to }) {
  return (
    <Link to={to} className="choice-card">
      <div className="choice-icon"><Icon size={25} /></div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="choice-arrow"><ArrowRight size={19} /></span>
    </Link>
  )
}

function HomePage() {
  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={15} />
              A LIVING ARCHIVE OF INDIA
            </div>

            <h1>
              Every place has a past.
              <br />
              <span>Every story has a place.</span>
            </h1>

            <p>
              Discover the monuments, memories, manuscripts and
              untold stories that make India's cultural heritage
              extraordinary.
            </p>

            <div className="hero-actions">
              <Link to="/welcome" className="primary-btn">
                Begin your journey <ArrowRight size={18} />
              </Link>
              <Link to="/contribute" className="outline-btn">
                <Camera size={17} /> Share your story
              </Link>
            </div>

            <div className="hero-note">
              28 STATES · COUNTLESS STORIES · ONE INDIA
            </div>
          </div>

          <div className="hero-art">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <HeritageScene />
            <span className="art-label">
              HERITAGE IN MOTION · 001
            </span>
          </div>
        </section>

        <section className="strip-section">
          <div className="strip-heading">
            <div className="section-kicker">A JOURNEY THROUGH INDIA</div>
            <h2>
              Not just places.
              <span> Living memories.</span>
            </h2>
            <p>
              From architectural wonders to forgotten corners,
              every image has a story worth preserving.
            </p>
          </div>

          <PhotoStrip />
          <PhotoStrip reverse />
        </section>

        <section className="welcome-section">
          <div className="welcome-copy">
            <div className="section-kicker">YOUR JOURNEY STARTS HERE</div>
            <h2>What brings you to <span>IndiaKaDNA?</span></h2>
            <p>
              Are you here to discover India's heritage, or do you
              have something to add to its growing archive?
            </p>
          </div>

          <div className="welcome-options">
            <ChoiceCard
              icon={Compass}
              title="I want to explore"
              description="Discover monuments, places, manuscripts and stories."
              to="/explore"
            />
            <ChoiceCard
              icon={Camera}
              title="I want to contribute"
              description="Upload photographs, review records or share knowledge."
              to="/contribute"
            />
          </div>
        </section>

        <section className="journey-section">
          <div className="journey-intro">
            <div className="section-kicker">DISCOVER THE ARCHIVE</div>
            <h2>India has more stories than we can count.</h2>
            <p>Choose a path and start discovering.</p>
          </div>

          <div className="journey-grid">
            <ChoiceCard
              icon={Landmark}
              title="Explore heritage"
              description="Discover India's cultural landmarks."
              to="/explore"
            />
            <ChoiceCard
              icon={BookOpen}
              title="Stories & manuscripts"
              description="Explore historical records and untold stories."
              to="/stories"
            />
            <ChoiceCard
              icon={MapPin}
              title="Explore the map"
              description="Travel across India, one state at a time."
              to="/map"
            />
            <ChoiceCard
              icon={Camera}
              title="Contribute"
              description="Help preserve India's cultural memory."
              to="/contribute"
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <Link to="/" className="brand">
        INDIA<span>KA</span>DNA<span className="brand-dot">.</span>
      </Link>
      <p>Preserving the past. Connecting the present.</p>
      <span>© 2026 IndiaKaDNA</span>
    </footer>
  )
}

function WelcomePage() {
  return (
    <main className="content-page">
      <div className="section-kicker">WELCOME TO INDIAKADNA</div>
      <h1>How would you like to experience India's heritage?</h1>
      <p className="page-lead">
        Explore the archive or become a part of preserving it.
      </p>

      <div className="choice-grid">
        <ChoiceCard
          icon={Compass}
          title="Explore the archive"
          description="Browse monuments, photographs, manuscripts and stories."
          to="/explore"
        />
        <ChoiceCard
          icon={Camera}
          title="Contribute to the archive"
          description="Upload your photographs or share your knowledge."
          to="/contribute"
        />
      </div>
    </main>
  )
}

function ExplorePage() {
  const [search, setSearch] = useState('')

  const collections = [
    { name: 'Monuments & Architecture', place: 'Discover India\'s built heritage', image: photos[0].src },
    { name: 'Art & Craft', place: 'Traditions, techniques and creativity', image: photos[1].src },
    { name: 'Sacred Spaces', place: 'Temples and historic places', image: photos[4].src },
    { name: 'Cultural Landscapes', place: 'Places shaped by people and time', image: photos[2].src }
  ]

  const filtered = collections.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="content-page">
      <div className="section-kicker">DISCOVER INDIA</div>
      <h1>Explore the heritage archive.</h1>
      <p className="page-lead">
        Discover the places, people and traditions that shape our history.
      </p>

      <div className="search-box">
        <Search size={19} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search collections..."
        />
      </div>

      <div className="collection-grid">
        {filtered.map(item => (
          <article className="collection-card" key={item.name}>
            <img src={item.image} alt={item.name} />
            <div>
              <h3>{item.name}</h3>
              <p>{item.place}</p>
              <span>Explore collection <ArrowRight size={15} /></span>
            </div>
          </article>
        ))}
        {filtered.length === 0 && <p>No collections found.</p>}
      </div>
    </main>
  )
}

function StoriesPage() {
  return (
    <main className="content-page">
      <div className="section-kicker">BEYOND THE MONUMENTS</div>
      <h1>Stories that deserve to be remembered.</h1>
      <p className="page-lead">
        Explore manuscripts, historical accounts, local memories and
        stories that have travelled across generations.
      </p>

      <div className="story-grid">
        <article className="story-card">
          <BookOpen size={28} />
          <h3>Manuscripts & scripts</h3>
          <p>Explore written records, languages and historic texts.</p>
        </article>
        <article className="story-card">
          <Lightbulb size={28} />
          <h3>Forgotten stories</h3>
          <p>Discover the lesser-known histories behind familiar places.</p>
        </article>
        <article className="story-card">
          <Camera size={28} />
          <h3>Then & Now</h3>
          <p>Compare historical photographs with present-day views.</p>
        </article>
      </div>
    </main>
  )
}

function MapPage() {
  return (
    <main className="content-page">
      <div className="section-kicker">DISCOVER BY LOCATION</div>
      <h1>India, one map. Countless stories.</h1>
      <p className="page-lead">
        Soon, you will be able to select a state, explore its cities
        and discover heritage sites across the country.
      </p>

      <div className="map-placeholder">
        <MapPin size={48} />
        <h2>Explore India's heritage geographically.</h2>
        <p>The interactive India map is the next feature we will build.</p>
      </div>
    </main>
  )
}

function ContributePage() {
  return (
    <main className="content-page">
      <div className="section-kicker">BECOME A PART OF THE ARCHIVE</div>
      <h1>Help keep India's stories alive.</h1>
      <p className="page-lead">
        Every photograph, correction and memory can help build a richer
        picture of our cultural heritage.
      </p>

      <div className="contribute-grid">
        <ChoiceCard
          icon={Upload}
          title="Upload photographs"
          description="Add your heritage photographs, captions and location details."
          to="/upload"
        />
        <ChoiceCard
          icon={ClipboardCheck}
          title="Review the archive"
          description="Help check photographs, descriptions and suggested tags."
          to="/review"
        />
        <ChoiceCard
          icon={Lightbulb}
          title="Share your knowledge"
          description="Suggest corrections, add context or share a local story."
          to="/knowledge"
        />
      </div>
    </main>
  )
}

function UploadPage() {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')

  function submit(event) {
    event.preventDefault()
    alert('Upload form ready! We will connect it to the backend next.')
  }

  return (
    <main className="content-page narrow-page">
      <div className="section-kicker">ADD TO THE ARCHIVE</div>
      <h1>Upload a photograph.</h1>
      <p className="page-lead">
        Share a photograph of a monument, place, artwork or cultural tradition.
      </p>

      <form className="contribution-form" onSubmit={submit}>
        <label className="upload-area">
          <Upload size={32} />
          <strong>{file ? file.name : 'Choose a photograph'}</strong>
          <span>JPG, PNG or WEBP</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            required
            onChange={e => setFile(e.target.files[0])}
          />
        </label>

        <label>
          Photograph title
          <input
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. A view of the Red Fort"
          />
        </label>

        <label>
          Location
          <input
            required
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="City, state"
          />
        </label>

        <button className="primary-btn" type="submit">
          Continue <ArrowRight size={18} />
        </button>
      </form>
    </main>
  )
}

function ReviewPage() {
  return (
    <main className="content-page">
      <div className="section-kicker">COMMUNITY REVIEW</div>
      <h1>Help us review the archive.</h1>
      <p className="page-lead">
        Review suggested descriptions, tags and historical information
        before they become part of the public archive.
      </p>
      <div className="map-placeholder">
        <ClipboardCheck size={45} />
        <h2>Community review workspace</h2>
        <p>Verified review records will appear here once the backend is connected.</p>
      </div>
    </main>
  )
}

function KnowledgePage() {
  const [story, setStory] = useState('')

  function submit(event) {
    event.preventDefault()
    alert('Your contribution form is ready to be connected to the backend.')
  }

  return (
    <main className="content-page narrow-page">
      <div className="section-kicker">SHARE WHAT YOU KNOW</div>
      <h1>Every voice adds a new perspective.</h1>
      <p className="page-lead">
        Share a local story, historical detail or correction.
      </p>
      <form className="contribution-form" onSubmit={submit}>
        <label>
          Your knowledge or suggestion
          <textarea
            required
            rows="7"
            value={story}
            onChange={e => setStory(e.target.value)}
            placeholder="Tell us what you know..."
          />
        </label>
        <button className="primary-btn" type="submit">
          Submit contribution <ArrowRight size={18} />
        </button>
      </form>
    </main>
  )
}

function AuthPage({ signup = false }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    alert('The form is ready. Real account authentication will be connected to the backend.')
  }

  return (
    <main className="auth-page">
      <div className="auth-visual">
        <img
          src={photos[0].src}
          alt="Indian heritage architecture"
        />
        <div className="auth-visual-content">
          <span>INDIAKADNA · YOUR HERITAGE JOURNEY</span>
          <h1>Some stories belong to all of us.</h1>
          <p>Explore, discover and help preserve India's cultural memory.</p>
        </div>
      </div>

      <div className="auth-form-side">
        <Link to="/" className="back-home">← Back to home</Link>

        <div className="auth-form-wrap">
          <div className="section-kicker">
            {signup ? 'JOIN THE ARCHIVE' : 'WELCOME BACK'}
          </div>
          <h2>{signup ? 'Create your account.' : 'Your journey awaits.'}</h2>
          <p className="auth-subtitle">
            {signup
              ? "Join a community keeping India's stories alive."
              : 'Sign in to continue exploring and contributing.'}
          </p>

          <form onSubmit={handleSubmit}>
            {signup && (
              <label>
                Full name
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                />
              </label>
            )}

            <label>
              Email address
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label>
              Password
              <div className="password-field">
                <input
                  required
                  minLength={6}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {!signup && (
              <Link className="forgot-link" to="/forgot-password">
                Forgot password?
              </Link>
            )}

            <button className="primary-btn auth-submit" type="submit">
              {signup ? 'Create account' : 'Log in'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-switch">
            {signup ? 'Already have an account?' : 'New to IndiaKaDNA?'}
            {' '}
            <Link to={signup ? '/login' : '/signup'}>
              {signup ? 'Log in' : 'Create an account'}
            </Link>
          </div>

          <div className="auth-divider"><span>OR</span></div>
          <Link to="/explore" className="guest-link">
            Continue as a guest <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  )
}

function ForgotPasswordPage() {
  return (
    <main className="content-page narrow-page">
      <div className="section-kicker">ACCOUNT HELP</div>
      <h1>Forgot your password?</h1>
      <p className="page-lead">
        Password recovery will be enabled when authentication is connected.
      </p>
      <Link to="/login" className="primary-btn">Back to login</Link>
    </main>
  )
}

function NotFound() {
  return (
    <main className="content-page">
      <h1>Page not found.</h1>
      <Link to="/" className="primary-btn">Back home</Link>
    </main>
  )
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/contribute" element={<ContributePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage signup />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App