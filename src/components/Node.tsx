import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

const ResizableNode = ({ data }) => {
  const [width, setWidth] = React.useState(150);
  const [height, setHeight] = React.useState(50);

  return (
    <div
      style={{
        border: '1px solid black',
        padding: '10px',
        width,
        height,
        resize: 'both',
        overflow: 'auto',
      }}
    >
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

export default ResizableNode;
