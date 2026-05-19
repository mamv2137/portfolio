/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
    	extend: {
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		fontFamily: {
    			mono: [
    				'"JetBrains Mono Variable"',
    				'ui-monospace',
    				'"JetBrains Mono"',
    				'Menlo',
    				'Consolas',
    				'"DejaVu Sans Mono"',
    				'monospace'
    			]
    		},
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},
    			tui: {
    				bg: 'var(--tui-bg)',
    				'bg-elev': 'var(--tui-bg-elev)',
    				fg: 'var(--tui-fg)',
    				muted: 'var(--tui-muted)',
    				border: 'var(--tui-border)',
    				accent: 'var(--tui-accent)',
    				success: 'var(--tui-success)',
    				warn: 'var(--tui-warn)',
    				error: 'var(--tui-error)',
    				info: 'var(--tui-info)',
    				selection: 'var(--tui-selection)',
    				caret: 'var(--tui-caret)'
    			}
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")],
}
