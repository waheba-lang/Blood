/**
 * Card Component
 * 
 * A simple, reusable wrapper component that applies a glass-morphism 
 * visual style (translucency + blur) to whatever is placed inside it.
 * 
 * @param {ReactNode} children - The content to display inside the card
 * @param {string} className - Optional extra CSS classes to apply
 */
export default function Card({ children, className = '' }) {
  return (
    // 'glass-panel' is a CSS class defined globally that creates the blurry glass effect
    <div className={`glass-panel ${className}`} style={{ padding: '1.5rem' }}>
      {children}
    </div>
  );
}
