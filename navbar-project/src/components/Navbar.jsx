import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { useLongPress } from '../hooks/useLongPress';
import { useTheme } from '../context/ThemeContext';
import OriginalThemeSwitcher from './ThemeSwitcher';
import OriginalLiveClock from './LiveClock';
import OriginalLiveDate from './Date';

const colorPalette = [
  { name: 'slate', light: 'text-slate-600', dark: 'text-slate-300', bg: 'bg-slate-500' },
  { name: 'red', light: 'text-red-600', dark: 'text-red-400', bg: 'bg-red-500' },
  { name: 'orange', light: 'text-orange-600', dark: 'text-orange-400', bg: 'bg-orange-500' },
  { name: 'amber', light: 'text-amber-600', dark: 'text-amber-400', bg: 'bg-amber-500' },
  { name: 'yellow', light: 'text-yellow-600', dark: 'text-yellow-400', bg: 'bg-yellow-500' },
  { name: 'lime', light: 'text-lime-600', dark: 'text-lime-400', bg: 'bg-lime-500' },
  { name: 'green', light: 'text-green-600', dark: 'text-green-400', bg: 'bg-green-500' },
  { name: 'emerald', light: 'text-emerald-600', dark: 'text-emerald-400', bg: 'bg-emerald-500' },
  { name: 'teal', light: 'text-teal-600', dark: 'text-teal-400', bg: 'bg-teal-500' },
  { name: 'cyan', light: 'text-cyan-600', dark: 'text-cyan-400', bg: 'bg-cyan-500' },
  { name: 'sky', light: 'text-sky-600', dark: 'text-sky-400', bg: 'bg-sky-500' },
  { name: 'blue', light: 'text-blue-600', dark: 'text-blue-400', bg: 'bg-blue-500' },
  { name: 'indigo', light: 'text-indigo-600', dark: 'text-indigo-400', bg: 'bg-indigo-500' },
  { name: 'violet', light: 'text-violet-600', dark: 'text-violet-400', bg: 'bg-violet-500' },
  { name: 'fuchsia', light: 'text-fuchsia-600', dark: 'text-fuchsia-400', bg: 'bg-fuchsia-500' },
];
const colorMap = new Map(colorPalette.map(c => [c.name, c]));

const fontPalette = [
  { name: 'Sans', className: 'font-[Inter]' },
  { name: 'Mono', className: 'font-[Roboto_Mono]' },
  { name: 'Tech', className: 'font-[Share_Tech_Mono]' },
  { name: 'Futura', className: 'font-[Exo_2]' },
  { name: 'Cosmic', className: 'font-[Orbitron]' },
];
const fontMap = new Map(fontPalette.map(f => [f.name, f]));

const navLinksMasterList = [
  { to: '/', label: 'Home', defaultColor: 'cyan', defaultFont: 'Sans' },
  { to: '/about', label: 'About', defaultColor: 'emerald', defaultFont: 'Sans' },
  { to: '/services', label: 'Services', defaultColor: 'orange', defaultFont: 'Sans' },
  { to: '/contact', label: 'Contact', defaultColor: 'fuchsia', defaultFont: 'Sans' },
];
const navLinksMap = new Map(navLinksMasterList.map(link => [link.label, link]));

const getDefaultColors = () => Object.fromEntries(navLinksMasterList.map(link => [link.label, link.defaultColor]));
const getDefaultFonts = () => Object.fromEntries(navLinksMasterList.map(link => [link.label, link.defaultFont]));

const FuturisticStyles = () => ( <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@700&family=Inter:wght@700&family=Orbitron:wght@700&family=Roboto+Mono:wght@700&family=Share+Tech+Mono&display=swap');
    .dark .animated-dark-bg { background-image: linear-gradient(-45deg, #0b0222, #21033a, #0b0222, #3c0663); background-size: 400% 400%; animation: animate-cosmic-bg 20s ease infinite; } @keyframes animate-cosmic-bg { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    .animated-bright-bg { background-image: linear-gradient(-45deg, #f0f9ff, #ecfeff, #faf5ff, #f3e8ff); background-size: 400% 400%; animation: animate-bright-bg 25s ease infinite; } @keyframes animate-bright-bg { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    .customization-pulse { animation: pulse-border 2s infinite; } @keyframes pulse-border { 0% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(168, 85, 247, 0); } 100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); } }
`}</style> );

const ThemeSwitcher = () => ( <div className="p-1 rounded-full transition-colors duration-300 hover:bg-black/10 dark:hover:bg-white/20"><OriginalThemeSwitcher/></div> );
const commonTextStyle = "text-sm font-bold tracking-wider text-slate-700 dark:text-cyan-300 dark:[text-shadow:0_0_5px_rgba(56,189,248,0.5)]";
const LiveDate = () => ( <div className={commonTextStyle}><OriginalLiveDate /></div> );
const LiveClock = () => ( <div className={commonTextStyle}><OriginalLiveClock /></div> );

const NavItem = ({ to, children, fontClass, ...props }) => {
    const { theme } = useTheme(); 
    const getStyle = (isActive) => { if (!isActive) return {}; if (theme === 'dark') { return { filter: `drop-shadow(0 0 7px ${props.darkColor}) drop-shadow(0 0 2px ${props.darkColor})` }; } if (props.label === 'Home') { return { textShadow: '0 0 8px rgba(14, 165, 233, 0.4)' }; } return {}; };
    return ( <li> <NavLink to={to} className={({ isActive }) => `relative group py-2 font-bold transition-all duration-300 ${fontClass} ${isActive ? `${props.lightColor} dark:${props.darkColor}` : 'text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white'}`} style={({isActive}) => getStyle(isActive)}> {children} <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-0 rounded-full opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-500 ease-out ${props.accentBg}`}></span> </NavLink> </li> );
};

const PickerPopup = ({ children }) => ( <div className="absolute top-full mt-2 z-20 w-48 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700">{children}</div> );

const ColorPicker = ({ onSelect, currentColorName }) => (
  <PickerPopup>
    <div className="grid grid-cols-5 gap-2">
      {colorPalette.map(color => ( <button key={color.name} aria-label={`Select ${color.name} color`} onClick={() => onSelect(color.name)} className={`w-7 h-7 rounded-full ${color.bg} transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 ${currentColorName === color.name ? 'ring-2 ring-offset-2 ring-sky-500 dark:ring-sky-400' : ''}`} /> ))}
    </div>
  </PickerPopup>
);

const FontPicker = ({ onSelect, currentFontName }) => (
  <PickerPopup>
    <div className="flex flex-col gap-1">
      {fontPalette.map(font => ( <button key={font.name} onClick={() => onSelect(font.name)} className={`px-3 py-1.5 text-left rounded-md transition-colors ${font.className} ${currentFontName === font.name ? 'bg-purple-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'}`}> {font.name} </button> ))}
    </div>
  </PickerPopup>
);

const DraggableNavItem = ({ label, colorName, fontName, onColorChange, onFontChange }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: label });
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isFontPickerOpen, setIsFontPickerOpen] = useState(false);
    const { theme } = useTheme();
    
    const color = colorMap.get(colorName) || colorMap.get('slate');
    const font = fontMap.get(fontName) || fontMap.get('Sans');

    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 20 : 1, };
    
    const handleColorSelect = (newColorName) => { onColorChange(label, newColorName); setIsColorPickerOpen(false); }
    const handleFontSelect = (newFontName) => { onFontChange(label, newFontName); setIsFontPickerOpen(false); }

    return (
        <li ref={setNodeRef} style={style} className="relative touch-none">
            <div className="flex items-center gap-1.5 rounded-md py-2 px-3 bg-slate-500/10 dark:bg-purple-400/10 border border-purple-500/30">
                <div {...attributes} {...listeners} className="cursor-grab p-1" aria-label={`Drag to reorder ${label}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-slate-500" viewBox="0 0 16 16"><path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                </div>
                <div className="flex-grow">
                    <span className={`font-bold text-base ${font.className} ${theme === 'light' ? color.light : color.dark}`}>{label}</span>
                </div>
                <button onClick={() => setIsFontPickerOpen(p => !p)} className="p-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10" aria-label={`Change font for ${label}`}> Tt </button>
                <button onClick={() => setIsColorPickerOpen(p => !p)} className={`w-5 h-5 rounded-full ${color.bg} border-2 border-white/50`} aria-label={`Change color for ${label}`} />
            </div>
            {isColorPickerOpen && <ColorPicker onSelect={handleColorSelect} currentColorName={colorName} />}
            {isFontPickerOpen && <FontPicker onSelect={handleFontSelect} currentFontName={fontName} />}
        </li>
    );
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrolled = useScrollPosition(50);
  const { theme } = useTheme();
  
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [navOrder, setNavOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('navOrder');
      if (!saved) return navLinksMasterList.map(l => l.label);
      const parsed = JSON.parse(saved);
      return navLinksMasterList.map(l => l.label).every(l => parsed.includes(l)) ? parsed : navLinksMasterList.map(l => l.label);
    } catch { return navLinksMasterList.map(l => l.label); }
  });
  const [navColors, setNavColors] = useState(() => { try { return JSON.parse(localStorage.getItem('navColors')) || getDefaultColors(); } catch { return getDefaultColors(); }});
  const [navFonts, setNavFonts] = useState(() => { try { return JSON.parse(localStorage.getItem('navFonts')) || getDefaultFonts(); } catch { return getDefaultFonts(); }});

  useEffect(() => { localStorage.setItem('navOrder', JSON.stringify(navOrder)); }, [navOrder]);
  useEffect(() => { localStorage.setItem('navColors', JSON.stringify(navColors)); }, [navColors]);
  useEffect(() => { localStorage.setItem('navFonts', JSON.stringify(navFonts)); }, [navFonts]);

  const orderedNavLinks = useMemo(() => {
    return navOrder.map(label => {
      const linkInfo = navLinksMap.get(label);
      const colorName = navColors[label] || 'slate';
      const fontName = navFonts[label] || 'Sans';
      const color = colorMap.get(colorName);
      const font = fontMap.get(fontName);
      return { ...linkInfo, lightColor: color.light, darkColor: color.dark, accentBg: color.bg, fontClass: font.className };
    });
  }, [navOrder, navColors, navFonts]);

  const handleColorChange = (label, colorName) => { setNavColors(prev => ({ ...prev, [label]: colorName })); };
  const handleFontChange = (label, fontName) => { setNavFonts(prev => ({...prev, [label]: fontName })); };
  const longPressEvents = useLongPress(() => setIsCustomizing(true), null);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && active.id !== over.id) { setNavOrder((items) => { const oldIndex = items.indexOf(active.id); const newIndex = items.indexOf(over.id); return arrayMove(items, oldIndex, newIndex); }); }
  }

  const scrolledClasses = scrolled ? `${theme === 'dark' ? 'animated-dark-bg' : 'animated-bright-bg'} backdrop-blur-lg shadow-xl shadow-slate-900/10 dark:border-b dark:border-purple-500/30 dark:shadow-purple-800/20` : 'bg-transparent';

  return (
    <>
      <FuturisticStyles />
      <header aria-label="Primary navigation" className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-in-out ${scrolledClasses}`}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="group">
             <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-purple-400 transition-all duration-300 ease-in-out">
                Welcome<span className="text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">_</span>
             </h1>
          </NavLink>

          <nav className="hidden md:flex items-center" aria-label="Desktop menu" {...longPressEvents}>
            {isCustomizing ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="flex items-center gap-4 rounded-lg p-2 border-2 border-dashed border-purple-500 customization-pulse">
                  <SortableContext items={navOrder} strategy={horizontalListSortingStrategy}>
                    <ul className="flex items-center space-x-2">
                      {navOrder.map(label => ( <DraggableNavItem key={label} label={label} colorName={navColors[label]} fontName={navFonts[label]} onColorChange={handleColorChange} onFontChange={handleFontChange}/> ))}
                    </ul>
                  </SortableContext>
                  <button onClick={() => setIsCustomizing(false)} className="ml-2 px-3 py-1.5 text-sm font-semibold rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"> Done </button>
                </div>
              </DndContext>
            ) : (
              <ul className="flex items-center space-x-8" title="Long press or use the settings icon to customize">
                {orderedNavLinks.map((link) => ( <NavItem key={link.to} {...link}>{link.label}</NavItem>))}
              </ul>
            )}
          </nav>
          
          <div className="flex items-center gap-2 text-slate-800 dark:text-white sm:gap-4">
              <div className="hidden sm:flex items-center gap-2"> <LiveDate /> <span className={`${commonTextStyle} opacity-70`}>-</span> <LiveClock /> </div>
              {!isCustomizing && (
                <button onClick={() => setIsCustomizing(true)} aria-label="Customize navigation" className="hidden md:block p-1 rounded-full transition-colors duration-300 hover:bg-black/10 dark:hover:bg-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
              )}
              <ThemeSwitcher />
              <div className="md:hidden">
                 <button aria-label="Toggle mobile menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="group relative z-10 flex h-10 w-10 items-center justify-center rounded-full">
                  <div className="absolute inset-0 rounded-full bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100 dark:bg-white/10"></div>
                  <div className={`h-full w-full transform transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'rotate-90' : ''}`}>
                    <span className={`absolute top-1/2 left-1/2 h-0.5 w-6 -translate-x-1/2 -translate-y-2 bg-slate-900 dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 w-7' : ''}`}></span>
                    <span className={`absolute top-1/2 left-1/2 h-0.5 w-6 -translate-x-1/2 bg-slate-900 dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`absolute top-1/2 left-1/2 h-0.5 w-6 -translate-x-1/2 translate-y-2 bg-slate-900 dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 w-7' : ''}`}></span>
                  </div>
                </button>
              </div>
          </div>
        </div>
        
        <div className={`absolute top-0 left-0 w-full md:hidden transition-transform duration-500 ease-in-out ${theme === 'dark' ? 'animated-dark-bg' : 'animated-bright-bg'} backdrop-blur-xl shadow-2xl ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <nav aria-label="Mobile menu" className="pt-24 pb-8">
            <ul className="flex flex-col gap-2">
              {orderedNavLinks.map((link) => (
                <li key={link.to} onClick={() => setIsMobileMenuOpen(false)}>
                  <NavLink to={link.to} className={({isActive}) => `block py-4 text-center text-xl font-bold transition-colors duration-300 ${link.fontClass} ${isActive ? `${link.accentBg} text-white` : `hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300`}`}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}