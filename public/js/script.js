export function showGrafo(grafo, positions, edges, qntArestas) {
  if (grafo.innerHTML) {
    grafo.innerHTML = "";
  }

  const space = positions.length < 10 ? 30 : 10;

  function createBol({ id }) {
    let top;
    let left;

    do {
      const generated = generatePositionXAndY();
      top = generated.top;
      left = generated.left;
    } while (existPosition(top, left));

    return `<div data-id="${id}" class="bol" style="${`top: ${top}%; left: ${left}%;`};">${id}</div>`;
  }

  function generatePositionXAndY() {
    return {
      top: Math.floor(Math.random() * 90),
      left: Math.floor(5 + Math.random() * 90),
    };
  }

  function existPosition(top, left) {
    const pixelTop = parseInt(top);
    const pixelLeft = parseInt(left);

    return positions
      .map(({ id }) => document.querySelector(`div[data-id="${id}"]`))
      .filter((e) => !!e)
      .some((e) => {
        const _top = parseInt(e.style.top);
        const _left = parseInt(e.style.left);

        if (isNaN(_top) || isNaN(_left)) {
          return false;
        }

        const calcTop = Math.abs(pixelTop - _top);
        const calcLeft = Math.abs(pixelLeft - _left);

        return (
          calcTop >= 0 && calcTop < space && calcLeft >= 0 && calcLeft < space
        );
      });
  }

  positions.forEach((position, index) =>
    setTimeout(() => (grafo.innerHTML += createBol(position)), 120 * index)
  );

  setTimeout(() => {
    function createEdge(origem, destino, label) {
      const origemElement = document.querySelector(`div[data-id="${origem}"]`);
      const destinoElement = document.querySelector(
        `div[data-id="${destino}"]`
      );

      if (origemElement && destinoElement) {
        const origemX =
          origemElement.offsetLeft + origemElement.offsetWidth / 2;
        const origemY =
          origemElement.offsetTop + origemElement.offsetHeight / 2;
        const destinoX =
          destinoElement.offsetLeft + destinoElement.offsetWidth / 2;
        const destinoY =
          destinoElement.offsetTop + destinoElement.offsetHeight / 2;

        const deltaX = destinoX - origemX;
        const deltaY = destinoY - origemY;

        const distancia = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        const angle = Math.atan2(deltaY, deltaX);

        const edge = document.createElement("div");
        edge.classList.add("edge");
        edge.style.position = "absolute";
        edge.style.width = `${distancia}px`;
        edge.style.transform = `rotate(${angle}rad)`;
        edge.style.left = `${origemX}px`;
        edge.style.top = `${origemY}px`;
        edge.setAttribute("data-origem", origem);
        edge.setAttribute("data-destino", destino);

        grafo.appendChild(edge);
      }
    }

    let qntArestasCriadas = 0;

    const intervalCode = setInterval(function () {
      if (qntArestasCriadas >= qntArestas) {
        return clearInterval(intervalCode);
      }

      edges.forEach(({ origem, destino, label }) => {
        createEdge(origem, destino, label);
        qntArestasCriadas++;
      });
    }, 500);

    setTimeout(() => clearInterval(intervalCode), 3000);
  }, 120 * positions.length);
}
