/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
        boxShadow: {
          'mine': '[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]'
        },
        colors: {
            'primary' : '#375bd2',
            'blue' : '#375bd2',
            'red' : '#f29186',
            'yellow' : '#ffc05d',
            'notwhite' : '#edf0e6',
            'darkblue' : '#48667e',
            'navy' : '#172e48',
            'header' : '#d7e4e2'
        },
        fontFamily: {
            'mont': ['Montserrat']
        }
    },
  },
  plugins: [],
}

