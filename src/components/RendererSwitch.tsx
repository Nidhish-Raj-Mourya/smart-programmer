import type { ReactNode } from 'react';
import type {
  CounterSnapshot,
  DataStructure,
  DigitSnapshot,
  GcdSnapshot,
  OutputBuilderSnapshot,
  SequenceSnapshot,
  ArraySnapshot,
  StepSnapshot,
} from '../engine/types';
import { CounterCanvas } from './renderers/CounterCanvas';
import { DigitCanvas } from './renderers/DigitCanvas';
import { GcdCanvas } from './renderers/GcdCanvas';
import { SequenceCanvas } from './renderers/SequenceCanvas';
import { OutputBuilderCanvas } from './renderers/OutputBuilderCanvas';
import { ArrayCanvas } from './renderers/ArrayCanvas';
import {
  CallStackCanvas,
  DPTableCanvas,
  GraphCanvas,
  LinkedListCanvas,
  QueueCanvas,
  StackCanvas,
  TreeCanvas,
} from './renderers/PlaceholderRenderers';

interface RendererSwitchProps {
  dataStructure: DataStructure;
  snapshot: StepSnapshot;
}

function assertSnapshot<T extends StepSnapshot>(
  snapshot: StepSnapshot,
  kind: string,
): snapshot is T {
  return typeof snapshot === 'object' && snapshot !== null && 'kind' in snapshot && snapshot.kind === kind;
}

export function RendererSwitch({ dataStructure, snapshot }: RendererSwitchProps): ReactNode {
  switch (dataStructure) {
    case 'counter':
      if (assertSnapshot<CounterSnapshot>(snapshot, 'counter')) {
        return <CounterCanvas snapshot={snapshot} />;
      }
      break;
    case 'digit':
      if (assertSnapshot<DigitSnapshot>(snapshot, 'digit')) {
        return <DigitCanvas snapshot={snapshot} />;
      }
      break;
    case 'gcd':
      if (assertSnapshot<GcdSnapshot>(snapshot, 'gcd')) {
        return <GcdCanvas snapshot={snapshot} />;
      }
      break;
    case 'sequence':
      if (assertSnapshot<SequenceSnapshot>(snapshot, 'sequence')) {
        return <SequenceCanvas snapshot={snapshot} />;
      }
      break;
    case 'outputbuilder':
      if (assertSnapshot<OutputBuilderSnapshot>(snapshot, 'outputbuilder')) {
        return <OutputBuilderCanvas snapshot={snapshot} />;
      }
      break;
    case 'array':
      if (assertSnapshot<ArraySnapshot>(snapshot, 'array')) {
        return <ArrayCanvas snapshot={snapshot} />;
      }
      break;
    case 'stack':
      return <StackCanvas />;
    case 'queue':
      return <QueueCanvas />;
    case 'linkedlist':
      return <LinkedListCanvas />;
    case 'tree':
      return <TreeCanvas />;
    case 'graph':
      return <GraphCanvas />;
    case 'callstack':
      return <CallStackCanvas />;
    case 'dptable':
      return <DPTableCanvas />;
    default:
      return <div className="renderer placeholder-canvas">Unknown renderer</div>;
  }

  return <div className="renderer placeholder-canvas">Waiting for snapshot…</div>;
}
