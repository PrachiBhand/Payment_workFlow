import React, { useRef, useCallback, useState, ReactNode } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Position,
  Edge,
  Node,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Handle } from '@xyflow/react';

interface CustomNode extends Node {
  data: {
    label: string;
    onDelete: () => void;
  };
}

interface CustomEdge extends Edge {
  label?: ReactNode;
}

const initialNodes: CustomNode[] = [
  {
    id: 'payment-node',
    type: 'customNode',
    data: { label: '$10 Payment', onDelete: () => {} },
    position: { x: 250, y: 5 },
    targetPosition: Position.Right,
    sourcePosition: Position.Left,
  },
  {
    id: 'england-node',
    type: 'customNode',
    data: { label: 'England', onDelete: () => {} },
    position: { x: 100, y: 150 },
    targetPosition: Position.Right,
    sourcePosition: Position.Left,
  },
  {
    id: 'america-node',
    type: 'customNode',
    data: { label: 'America', onDelete: () => {} },
    position: { x: 400, y: 150 },
    targetPosition: Position.Right,
    sourcePosition: Position.Left,
  },
];

let nodeId = 0;
let edgeId = 0;
const getNodeId = () => `dndnode_${nodeId++}`;
const getEdgeId = () => `edge_${edgeId++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
  const { screenToFlowPosition } = useReactFlow();
  const [selectedProvider, setSelectedProvider] = useState<string>('');

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdge: CustomEdge = { 
        ...params,
        id: getEdgeId(),
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      if (nodes.some((node) => node.data.label === `${selectedProvider} node`)) {
        return;
      }

      const newNode: CustomNode = {
        id: getNodeId(),
        type: 'customNode',
        position,
        data: { label: `${selectedProvider} node`, onDelete: () => handleDeleteNode(newNode.id) },
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedProvider('');
    },
    [screenToFlowPosition, nodes, selectedProvider, setNodes]
  );

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  const handleDeleteEdge = (edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  };

  const handleAddProvider = () => {
    if (!selectedProvider) return;

    const position = { x: 250, y: 100 };

    if (nodes.some((node) => node.data.label === `${selectedProvider} node`)) {
      return;
    }

    const newNode: CustomNode = {
      id: getNodeId(),
      type: 'customNode',
      position,
      data: { label: `${selectedProvider} node`, onDelete: () => handleDeleteNode(newNode.id) },
    };

    setNodes((nds) => nds.concat(newNode));
    setSelectedProvider('');
  };

  const CustomNode = ({ data, id }: { data: CustomNode['data']; id: string }) => {
    const isDefaultNode = ['payment-node', 'england-node', 'america-node'].includes(id);

    return (
      <div style={{ position: 'relative', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff' }}>
        <div>{data.label}</div>
        {!isDefaultNode && (
          <button
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              borderRadius: '50%',
              border: 'none',
              background: '#ff4d4d',
              color: '#fff',
              cursor: 'pointer',
              width: '20px',
              height: '20px',
            }}
            onClick={data.onDelete}
          >
            x
          </button>
        )}
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    );
  };

  const CustomEdge = ({ id, source, target, label }: CustomEdge) => (
    <div>
      <div>{`${source} -> ${target}`}</div>
      {label}
    </div>
  );

  return (
    <div className="dndflow" style={{ display: 'flex', height: '100vh' }}>
      <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{ customNode: CustomNode }}
          edgeTypes={{ customEdge: CustomEdge }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Controls />
        </ReactFlow>
      </div>
      <div style={{ width: '200px', padding: '10px', background: '#f0f0f0', border: '1px solid #ccc' }}>
        <h3>Select Payment Provider</h3>
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          style={{ width: '100%', padding: '5px' }}
        >
          <option value="">Select a provider</option>
          <option value="Google Pay">Google Pay</option>
          <option value="Apple Pay">Apple Pay</option>
          <option value="Stripe">Stripe</option>
          <option value="PayPal">PayPal</option>
        </select>
        <button onClick={handleAddProvider} style={{ marginTop: '10px', width: '100%' }}>
          Add Provider
        </button>
      </div>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDFlow />
    </ReactFlowProvider>
    );
