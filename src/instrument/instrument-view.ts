import type { InstrumentState, Control } from './instrument';
import type { createInputMapping } from './input-mapping';
import type { InstrumentLayout } from './instrument-layout';
import './instrument-view.css';

type InstrumentViewOptions = {
  initialState: InstrumentState;
  layout: InstrumentLayout;
  inputMapping: ReturnType<typeof createInputMapping>;
};

export function createInstrumentView(root: HTMLElement, { initialState, layout, inputMapping }: InstrumentViewOptions) {
  const elementById = new Map(initialState.controls.map((element) => [element.id, element]));
  const elementNodes = new Map<string, HTMLElement>();

  root.innerHTML = '';
  root.className = 'instrument-page';

  const instrument = document.createElement('section');
  instrument.className = 'instrument-ui';
  instrument.ariaLabel = layout.label;
  instrument.style.setProperty('--instrument-base-control-count', String(layout.baseControlCount));

  const baseLayer = document.createElement('div');
  baseLayer.className = 'instrument-ui-base-layer';

  const raisedLayer = document.createElement('div');
  raisedLayer.className = 'instrument-ui-raised-layer';

  for (const layoutControl of layout.controls) {
    const element = elementById.get(layoutControl.controlId);

    if (!element) {
      continue;
    }

    const node = createControlNode(element, inputMapping.labelForControl(element.id));
    node.classList.add(`instrument-control-${layoutControl.layer}`);

    if (layoutControl.leftPercent !== undefined) {
      node.style.left = `${layoutControl.leftPercent}%`;
    }

    elementNodes.set(element.id, node);
    (layoutControl.layer === 'raised' ? raisedLayer : baseLayer).append(node);
  }

  const disclaimer = document.createElement('p');
  disclaimer.className = 'instrument-ui-disclaimer';
  disclaimer.textContent = 'Uses physical input positions; labels may differ by device or layout.';

  instrument.append(baseLayer, raisedLayer);
  root.append(instrument, disclaimer);

  function update(state: InstrumentState) {
    for (const element of state.controls) {
      const node = elementNodes.get(element.id);

      if (!node) {
        continue;
      }

      const isActive = state.activeControlIds.has(element.id);
      node.classList.toggle('is-active', isActive);
      node.ariaPressed = String(isActive);
    }
  }

  update(initialState);

  return { update };
}

function createControlNode(element: Control, inputLabel: string | undefined) {
  const node = document.createElement('button');
  node.type = 'button';
  node.className = 'instrument-control';
  node.dataset.instrumentControlId = element.id;
  node.ariaLabel = inputLabel ? `${element.label}, input ${inputLabel}` : element.label;
  node.disabled = true;

  const elementLabel = document.createElement('span');
  elementLabel.className = 'instrument-control-label';
  elementLabel.textContent = element.label;

  node.append(elementLabel);

  if (inputLabel) {
    const inputLabelNode = document.createElement('span');
    inputLabelNode.className = 'instrument-ui-input-label';
    inputLabelNode.textContent = inputLabel;
    node.append(inputLabelNode);
  }

  return node;
}
