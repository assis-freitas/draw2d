

/**
 * @class
 *
 * <Disclaimer> Writing my own class for arrays was one of my worst ideas...
 *
 * An ArrayList stores a variable number of objects. This is similar to making an array of
 * objects, but with an ArrayList, items can be easily added and removed from the ArrayList
 * and it is resized dynamically. This can be very convenient, but it's slower than making
 * an array of objects when using many elements.
 */
class ArrayList {
    public static EMPTY_LIST = new ArrayList();

    constructor(private data: any[] = []) {
    }

    /**
     *
     * Clears the array
     *
     * @since 6.1.0
     * @returns {this}
     */
    clear () {
      this.data = []

      return this
    }
    /**
     *
     * Reverses the order of the elements in the ArrayList. The array will be modified!
     *
     * @returns {this}
     */
    reverse () {
      this.data.reverse()

      return this
    }
    /**
     *
     * The size/count of the stored objects.
     *
     * @returns {Number}
     */
    getSize () {
      return this.data.length
    }

    /**
     *
     * checks to see if the Vector has any elements.
     *
     * @returns {Boolean} true if the list is empty
     **/
    isEmpty () {
      return this.getSize() === 0
    }
    /**
     *
     * return the last element.
     *
     * @returns {Object}
     */
    last () {
      return this.data[this.data.length - 1]
    }
    /**
     *
     * Return a reference to the internal javascript native array.
     *
     * @returns {Array}
     */
    asArray () {
      return this.data
    }
    /**
     *
     * returns the first element
     *
     * @returns {Object}
     */
    first () {
      if (this.data.length > 0) {
        return this.data[0]
      }
      return null
    }

    /**
     *
     * returns an element at a specified index
     *
     * @param {Number} i
     * @returns {Object}
     */
    get (i: number) {
      return this.data[i]
    }
    /**
     *
     * Adds a element at the end of the Vector.
     *
     * @returns {this}
     * @param objs
     */
    add (...objs: any[]) {
      this.data.push(...objs)

      return this
    }
    /**
     *
     *
     * The method removes items from an array as necessary so that all remaining items pass a
     * provided test. The test is a function that is passed an array item and the index of the
     * item within the array. Only if the test returns true will the item stay in the array.
     *
     * @param {Function} func the filter function(element,index)
     * @param {Object} func.value value of the element in iteration.
     * @since 2.0.0
     * @returns {this}
     */
    grep (func: (value: any, index: number, array: any[]) => boolean) {
      this.data = this.data.filter(func)

      return this
    }
    /**
     *
     *
     * Return ONE element which matches by the given function or <b>null</b>
     * if no element is found.
     *
     *    var r1= figures.find(function(figure){
     *                  return figure.id===123456
     *            });
     *
     * @param {Function} func the filter function
     * @param {Object} func.value value of the element in iteration.
     * @param {Object} func.index index of the element in collection.
     * @since 2.0.0
     */
    find (func: (this:void, value: any, index: number, obj: any[]) => boolean) {
      return this.data.find(func);
    }
    /**
     *
     * Translate all items in the array into new items. The array list is modified after this call.
     * You must clone the array before if you want avoid this.
     *
     *    var labels = this.commands.clone().map(function(e){
     *         return e.getLabel();
     *    });
     *
     * @param {Function} func The function to process each item against. The first argument to the function is the value; the second argument is the index or key of the array or object property.
     * @param {Object} func.value value of the element in iteration.
     * @param {Number} func.i index of the element in iteration
     *
     * @since 4.0.0
     * @returns {this}
     */
    map (func: (value: any, index: number, array: any[]) => any) {
      this.data = this.data.map(func)

      return this
    }
    /**
     *
     * Removes any duplicate elements from the array. The array is modified after this call. You
     * must clone the array before if you want avoid this
     *
     * @since 4.0.0
     * @returns {this}
     */
    unique () {
      this.data = Array.from(new Set(this.data));

      return this
    }

    /**
     *
     * Add all elements into this array.
     *
     * @param {draw2d.util.ArrayList} list
     * @param {Boolean} [avoidDuplicates] checks whenever the new elements exists before insert if the parameter is to [true]
     * @returns {this}
     */
    addAll (list: ArrayList, avoidDuplicates = false) {
      this.data = this.data.concat(list.data)
      if (avoidDuplicates) {
        this.unique()
      }
      return this
    }
    /**
     *
     * You can use the Array list as Stack as well. this is the pop method to remove one element
     * at the end of the stack.
     *
     * @returns {Object} the remove object
     */
    pop () {
      return this.removeElementAt(this.data.length - 1)
    }
    /**
     * Push one element at the top of the stack/array
     *
     * @param {Object} value The object to add
     * @returns {this}
     */
    push (value: any) {
      this.add(value)
    }
    /**
     *
     * Remove the element from the list
     *
     * @param {Object} obj the object to remove
     *
     * @returns {Object} the removed object or null
     */
    remove (obj: any) {
      let index = this.indexOf(obj)
      if (index >= 0) {
        return this.removeElementAt(index)
      }

      return null
    }

    /**
     *
     * Inserts an element at a given position. Existing elements will be shifted
     * to the right.
     *
     * @param {Object} obj the object to insert.
     * @param {Number} index the insert position.
     * @returns {this}
     */
    insertElementAt (obj: any, index: number) {
      this.data.splice(index, 0, obj)

      return this
    }
    /**
     *
     * Removes an element at a specific index.
     *
     * @param {Number} index the index of the element to remove
     * @returns {Object} the removed object
     */
    removeElementAt (index: number) {
      let element = this.data[index]

      this.data.splice(index, 1)

      return element
    }
    /**
     *
     * removes all given elements in the ArrayList
     *
     * @param {draw2d.util.ArrayList} elements The elements to remove
     * @returns {this}
     */
    removeAll (elements: ArrayList) {
        const data = elements.data;


        data.forEach((e) => {
          this.remove(e)
        })


      return this
    }
    /**
     *
     * Return the zero based index of the given element or -1 if the element
     * not in the list.
     *
     * @param {Object} obj the element to check
     *
     * @returns {Number} the index of the element or -1
     */
    indexOf (obj: any) {
      return this.data.indexOf(obj)
    }
    /**
     *
     * returns true if the element is in the Vector, otherwise false.
     *
     * @param {Object} obj the object to check
     *
     * @returns {Boolean}
     */
    contains (obj: any) {
      return this.indexOf(obj) !== -1
    }

    /**
     *
     * Sorts the collection based on a field name or sort a function. See on http://www.w3schools.com/jsref/jsref_sort.asp
     * if you use a sort function.
     *
     * @param {String|Function} f the field name for the sorting or a sort function
     *
     * @returns {this}
     *
     */
    sort (f: string | ((a: any, b: any) => number)) {
      if (typeof f === "function") {
        this.data.sort(f)
      } else {
        this.data.sort(function (a, b) {
          if (a[f] < b[f])
            return -1
          if (a[f] > b[f])
            return 1
          return 0
        })
      }
      return this
    }
    /**
     *
     * Copies the contents of a Vector to another Vector returning the new Vector.
     *
     * @param {Boolean} [deep] call "clone" of each elements and add the clone to the new ArrayList
     *
     * @returns {draw2d.util.ArrayList} the new ArrayList
     */
    clone (deep = false) {
      let newVector = new ArrayList();


      if (deep) {
        this.data.forEach((d) => newVector.data.push(d.clone()));
      } else {
        newVector.data = this.data.slice(0)
      }

      return newVector
    }

    /**
     *
     * Iterates over the list of elements, yielding each in turn to an iterator
     * function.
     * Each invocation of iterator is called with two arguments: (index, element).
     *
     * @param {Function} func the callback function to call for each element
     * @param {Number} func.i index of the element in iteration
     * @param {Object} func.value value of the element in iteration.
     * @param {Boolean} [reverse] optional parameter. Iterate the collection reverse if it set to <b>true</b>
     * @returns {this}
     */
    each (func: (value: any, index: number, array: any[]) => void, reverse = false) {
        let data = this.data;

        if (reverse) {
            data = data.reverse();
        }

        data.forEach(func);

        return this
    }

    /**
     * overwrites the element with an object at the specific index.
     *
     * @param {Object} obj The object to add
     * @param {Number} index the index where the object should places.
     *
     * @returns {this}
     */
    overwriteElementAt (obj: any, index: number) {
      this.data[index] = obj

      return this
    }
    /**
     *
     * @returns {Object} the attributes which are required for persistence
     */
    getPersistentAttributes () {
      return {data: this.data}
    }
    /**
     *
     * Read all attributes from the serialized properties and transfer them into the shape.
     *
     * @param {Object} memento
     * @returns {this}
     */
    setPersistentAttributes (memento: any) {
      this.data = memento.data

      return this
    }


  }

  export default ArrayList;


