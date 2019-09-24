export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const TYPES = {
  'transfer': [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`],
  'activity': [`restaurant`, `sightseeing`, `check-in`]
};
