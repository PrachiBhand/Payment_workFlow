import React from 'react';

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">
        Drag these payment providers to the canvas on the right.
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, 'Google Pay')}
        draggable
      >
        Google Pay
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, 'Apple Pay')}
        draggable
      >
        Apple Pay
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, 'Stripe')}
        draggable
      >
        Stripe
      </div>
    </aside>
  );
};

export default Sidebar;
