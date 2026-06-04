import React, { useState, useRef, useEffect, ReactNode } from 'react';
import './popover.css';

type PopoverProps = {
  trigger: ReactNode;
  content: ReactNode;
  position?: 'left' | 'right' | 'bottom' | 'top'
};

const Popover: React.FC<PopoverProps> = ({ trigger, content, position = 'bottom' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [positionStyle, setPositionStyle] = React.useState<any>()


  React.useEffect(() => {
    switch (position) {
      case 'left':
        setPositionStyle({
          top: 0,
          left: 0,
          transform: `translate(-100%, 0)`
        })
        break;
      case 'right':
        setPositionStyle({
          top: 0,
          right: 0,
          transform: `translate(100%, 0)`
        })
        break;
      case 'bottom':
        setPositionStyle({
          bottom: 0,
          left: '100%',
          transform: `translate(-100%, 105%)`
        })        // code block to execute if expression === value2
        break;
      case 'top':
        setPositionStyle({
          top: 0,
          left: '100%',
          transform: `translate(-100%, -105%)`
        })
        break;
      default:
        setPositionStyle({
          bottom: 0,
          left: '100%',
          transform: `translate(-100%, 105%)`
        })
    }
  }, [position])

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="popover-wrapper" ref={menuRef}>
      {/* Trigger */}
      <div className="trigger-ui" onClick={toggleMenu}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            toggleMenu()
          }
        }}
      >
        {trigger}
      </div>

      {/* Content */}
      <div
        className={`popover-content ${isOpen ? 'show' : ''}`}
        style={positionStyle}
        onClick={toggleMenu}
      >
        {content}
      </div>
    </div>
  );
};

export default Popover;

