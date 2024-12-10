// FROM: https://github.com/TheAlgorithms/TypeScript

/* Stack data-structure. It's work is based on the LIFO method (last-IN-first-OUT).
 * It means that elements added to the stack are placed on the top and only the
 * last element (from the top) can be reached. After we get access to the last
 * element, it pops from the stack.
 * This is a class-based implementation of a Stack.
 */
export class Stack<T> {
  private stack: T[] = []
  private limit: number

  /**
   * constructor of the stack, can set a limit, if not provided there is no limit to the stack.
   * @param {number} [limit=Number.MAX_VALUE] the limit of the stack
   */
  constructor(limit: number = Number.MAX_VALUE) {
    this.limit = limit
  }

  /**
   * @function push
   * @description - adds a new element to the stack
   * @param {T} value - the new value to add
   */
  push(value: T) {
    if (this.length() + 1 > this.limit) {
      throw new Error('Stack Overflow')
    }

    this.stack.push(value)
  }

  /**
   * @function pop
   * @description - remove an element from the top
   * @throws will throw an error if the stack is empty
   * @return {T} removed element
   */
  pop(): T {
    if (this.length() !== 0) {
      return this.stack.pop() as T
    }

    throw new Error('Stack Underflow')
  }

  /**
   * @function length
   * @description - number of elements in the stack
   * @return {number} the number of elements in the stack
   */
  length(): number {
    return this.stack.length
  }

  /**
   * @function isEmpty
   * @description - check if the stack is empty
   * @return {boolean} returns true if the stack is empty, otherwise false
   */
  isEmpty(): boolean {
    return this.length() === 0
  }

  /**
   * @function top
   * @description - return the last element in the stack without removing it
   * @return {T | null} return the last element or null if the stack is empty
   */
  top(): T | null {
    if (this.length() !== 0) {
      return this.stack[this.length() - 1]
    }

    return null
  }
}

export interface Queue<T> {
  enqueue(item: T): void
  dequeue(): T | undefined
  peek(): T | undefined | null
  isEmpty(): boolean
  length(): number
}

/**
 * A Stack Based Queue Implementation.
 * The Queue data structure which follows the FIFO (First in First Out) rule.
 * The dequeue operation in a normal stack based queue would be o(n), as the entire has to be shifted
 * With the help of two stacks, the time complexity of this can be brought down to amortized-O(1).
 * Here, one stack acts as an Enqueue stack where elements are added.
 * The other stack acts as a dequeue stack which helps in dequeuing the elements
 */

export class StackQueue<T> implements Queue<T> {
  private enqueueStack: Stack<T> = new Stack<T>()
  private dequeueStack: Stack<T> = new Stack<T>()

  /**
   * Returns the length of the Queue
   *
   * @returns {number} the length of the Queue
   */
  length(): number {
    return this.enqueueStack.length() + this.dequeueStack.length()
  }

  /**
   * Checks if the queue is empty.
   *
   * @returns {boolean} Whether the queue is empty or not.
   */
  isEmpty(): boolean {
    return this.enqueueStack.isEmpty() && this.dequeueStack.isEmpty()
  }

  /**
   * Adds an item to the queue.
   * We always add a new item to the enqueueStack.
   * @param item The item being added to the queue.
   */
  enqueue(item: T): void {
    this.enqueueStack.push(item)
  }

  /**
   * Shifts the elements from the enqueueStack to the dequeueStack
   * In the worst case, all the elements from the enqueue stack needs to shifted, which needs O(n) time.
   * However, after the shift, elements can de dequeued at O(1).
   * This helps in dequeuing the elements in amortized O(1) time.
   */
  private shift(): void {
    while (!this.enqueueStack.isEmpty()) {
      const enqueueStackTop = this.enqueueStack.pop()
      this.dequeueStack.push(enqueueStackTop)
    }
  }

  /**
   * Removes an item from the queue and returns it.
   *
   * @throws Queue Underflow if the queue is empty.
   * @returns The item that was removed from the queue.
   */
  dequeue(): T {
    if (this.isEmpty()) {
      throw new Error('Queue Underflow')
    }

    if (this.dequeueStack.isEmpty()) {
      this.shift()
    }

    return this.dequeueStack.pop()
  }

  /**
   * Returns the item at the front of the queue.
   *
   * @returns The item at the front of the queue or null if the queue is empty.
   */
  peek(): T | null {
    if (this.isEmpty()) {
      return null
    }

    if (this.dequeueStack.isEmpty()) {
      this.shift()
    }

    return this.dequeueStack.top()
  }
}

/**
 * @function edmondsKarp
 * @description Compute the maximum flow from a source node to a sink node using the Edmonds-Karp algorithm.
 * @Complexity_Analysis
 * Time complexity: O(V * E^2) where V is the number of vertices and E is the number of edges.
 * Space Complexity: O(E) due to residual graph representation.
 * @param {[number, number][][]} graph - The graph in adjacency list form.
 * @param {number} source - The source node.
 * @param {number} sink - The sink node.
 * @return {number} - The maximum flow from the source node to the sink node.
 * @see https://en.wikipedia.org/wiki/Edmonds%E2%80%93Karp_algorithm
 */
export default function edmondsKarp(
  graph: [number, number][][],
  source: number,
  sink: number,
): number {
  const n = graph.length

  // Initialize residual graph
  const residualGraph: [number, number][][] = Array.from(
    { length: n },
    () => [],
  )

  // Build residual graph from the original graph
  for (let u = 0; u < n; u++) {
    for (const [v, cap] of graph[u]) {
      if (cap > 0) {
        residualGraph[u].push([v, cap]) // Forward edge
        residualGraph[v].push([u, 0]) // Reverse edge with 0 capacity
      }
    }
  }

  const findAugmentingPath = (parent: (number | null)[]): number => {
    const visited = Array(n).fill(false)
    const queue = new StackQueue<number>()
    queue.enqueue(source)
    visited[source] = true
    parent[source] = null

    while (queue.length() > 0) {
      const u = queue.dequeue()
      for (const [v, cap] of residualGraph[u]) {
        if (!visited[v] && cap > 0) {
          parent[v] = u
          visited[v] = true
          if (v === sink) {
            // Return the bottleneck capacity along the path
            let pathFlow = Infinity
            let current = v
            while (parent[current] !== null) {
              const prev = parent[current]!
              const edgeCap = residualGraph[prev].find(
                ([node]) => node === current,
              )![1]
              pathFlow = Math.min(pathFlow, edgeCap)
              current = prev
            }
            return pathFlow
          }
          queue.enqueue(v)
        }
      }
    }
    return 0
  }

  let maxFlow = 0
  const parent = Array(n).fill(null)

  while (true) {
    const pathFlow = findAugmentingPath(parent)
    if (pathFlow === 0) break // No augmenting path found

    // Update the capacities and reverse capacities in the residual graph
    let v = sink
    while (parent[v] !== null) {
      const u = parent[v]!
      // Update capacity of the forward edge
      const forwardEdge = residualGraph[u].find(([node]) => node === v)!
      forwardEdge[1] -= pathFlow
      // Update capacity of the reverse edge
      const reverseEdge = residualGraph[v].find(([node]) => node === u)!
      reverseEdge[1] += pathFlow

      v = u
    }

    maxFlow += pathFlow
  }

  return maxFlow
}
