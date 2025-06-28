/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Medieval color palette
        medieval: {
          gold: '#D4AF37',
          'gold-dark': '#B8860B',
          bronze: '#CD7F32',
          'bronze-dark': '#A0522D',
          silver: '#C0C0C0',
          'silver-dark': '#A8A8A8',
          parchment: '#F4E4BC',
          'parchment-dark': '#E6D5A8',
        },
        // D&D class colors
        classes: {
          barbarian: '#E74C3C',
          bard: '#F39C12',
          cleric: '#F7DC6F',
          druid: '#58D68D',
          fighter: '#CB4335',
          monk: '#85C1E9',
          paladin: '#F8C471',
          ranger: '#82E0AA',
          rogue: '#A569BD',
          sorcerer: '#EC7063',
          warlock: '#8E44AD',
          wizard: '#5DADE2',
        },
        // Ability score colors
        abilities: {
          strength: '#E74C3C',
          dexterity: '#2ECC71',
          constitution: '#F39C12',
          intelligence: '#3498DB',
          wisdom: '#9B59B6',
          charisma: '#E91E63',
        }
      },
      fontFamily: {
        medieval: ['Cinzel', 'serif'],
        'medieval-decorative': ['Cinzel Decorative', 'serif'],
        fantasy: ['MedievalSharp', 'cursive'],
      },
      backgroundImage: {
        'medieval-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        'parchment': "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"%3E%3Cdefs%3E%3Cfilter id=\"paper\" x=\"0%25\" y=\"0%25\" width=\"100%25\" height=\"100%25\"%3E%3CfeTurbulence baseFrequency=\"0.04\" numOctaves=\"5\" result=\"noise\" seed=\"1\"/%3E%3CfeColorMatrix in=\"noise\" type=\"saturate\" values=\"0\"/%3E%3C/filter%3E%3C/defs%3E%3Crect width=\"100\" height=\"100\" filter=\"url(%23paper)\" opacity=\"0.4\"/%3E%3C/svg%3E')",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.8)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [
    // Add custom utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        },
        '.text-shadow-lg': {
          textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
        },
        '.medieval-border': {
          border: '2px solid #D4AF37',
          borderImage: 'linear-gradient(45deg, #D4AF37, #B8860B, #D4AF37) 1',
        },
        '.parchment-bg': {
          backgroundImage: 'linear-gradient(45deg, #F4E4BC 25%, transparent 25%), linear-gradient(-45deg, #F4E4BC 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #F4E4BC 75%), linear-gradient(-45deg, transparent 75%, #F4E4BC 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        }
      }
      addUtilities(newUtilities)
    }
  ],
}