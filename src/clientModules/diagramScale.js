// Keeps Mermaid diagrams readable on narrow screens. Mermaid draws each diagram at its natural width
// and lets it shrink to fit the column; past a point the labels become unreadable. This gives each
// diagram a minimum width of 60% of its natural size, so on a phone a wide diagram scrolls sideways
// inside its container (overflow-x: auto in custom.css) instead of shrinking further.
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const MIN_SCALE = 0.6;

function fit(svg) {
  const width = svg.viewBox && svg.viewBox.baseVal ? svg.viewBox.baseVal.width : 0;
  if (width > 0) svg.style.minWidth = `${Math.round(width * MIN_SCALE)}px`;
}

function scan(root) {
  root.querySelectorAll('.docusaurus-mermaid-container svg').forEach(fit);
}

if (ExecutionEnvironment.canUseDOM) {
  new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches && node.matches('.docusaurus-mermaid-container svg')) fit(node);
        else if (node.querySelectorAll) scan(node);
      }
    }
  }).observe(document.documentElement, {childList: true, subtree: true});
}

export function onRouteDidUpdate() {
  if (ExecutionEnvironment.canUseDOM) scan(document);
}
