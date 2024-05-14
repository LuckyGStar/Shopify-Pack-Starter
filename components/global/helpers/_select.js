const nodeListPrototype = {
  execute(fn) {
    if (this instanceof Element || this instanceof HTMLDocument) {
      fn(this);
    } else {
      this.forEach((node, index) => {
        fn(node, index);
      });
    }
  },
  listen(eventName, callback, dynamic) {
    const callbackWithNode = ($node, index) => (e) =>
      callback({ $node, index, e });

    this.execute((node, index) => {
      const extendedNode = Object.assign(node, nodeListPrototype);
      if (dynamic) {
        document.addEventListener(eventName, (e) => {
          const $intendedNode = e.target.closest(this.selectedWith);
          if ($intendedNode) {
            callbackWithNode(extendedNode, index)(e);
          }
        });
      } else {
        extendedNode.addEventListener(eventName, (e) =>
          callbackWithNode(extendedNode, index)(e)
        );
      }
    });
  },
  modifyClass(method, className) {
    this.execute((node) => node.classList[method](className));
  },
};

export function select(selector, parent = document) {
  /*
    Preferred selector value is a data attribute, checked here.
  */
  const improperSelectorPassed =
    typeof selector === 'string' && selector.indexOf('[') !== 0;

  /*
    Selector can either be a node or string.
    If string, select the appropriate nodes within the parent (default is document),
    otherwise continue
  */
  const object =
    typeof selector === 'string' ? parent.querySelectorAll(selector) : selector;

  /*
    For each node, attach the custom helper functions from the nodeListPrototype above
  */
  const mappedObject = [...object].map((item) =>
    Object.assign(item, nodeListPrototype, { selectedWith: selector })
  );

  /*
    If the node list contains only a single node, return the node itself, otherwise return the array of nodes
  */
  const selectObject =
    mappedObject && mappedObject.length === 1 ? mappedObject[0] : mappedObject;

  /*
    Attach the custom helper functions to the returned object itself.
    (Useful for executing a custom function every item in the object)
  */
  const extendedObject = Object.assign(selectObject, nodeListPrototype);

  /*
    If a data attribute was not used as selector, warn in the console
  */
  if (improperSelectorPassed) {
    console.warn(
      'Improper selector value passed. Please use data attribute as selector.'
    );
  }
  return extendedObject;
}