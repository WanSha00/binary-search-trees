const Node = (value = null, leftChild = null, rightChild = null) => {
  return {
    value: value,
    leftChild: leftChild,
    rightChild: rightChild,
  };
};

class Tree {
  constructor(array) {
    //remove duplicates with Set
    const sortedArray = [...new Set(array)];

    //sort the array
    sortedArray.sort((a, b) => a - b);

    this.root = this.buildTree(sortedArray);

    console.log(sortedArray);
    console.log("root: " + this.root);
  }

  //build tree with sorted array
  buildTree(sortedArray) {
    if (sortedArray.length === 0) return null;

    const mid = Math.floor(sortedArray.length / 2);

    //new node with value at mid
    const newNode = Node(sortedArray[mid]);

    //from index 0, up to mid
    newNode.leftChild = this.buildTree(sortedArray.slice(0, mid));
    //from index mid+1 and all the rest
    newNode.rightChild = this.buildTree(sortedArray.slice(mid + 1));

    return newNode;
    
  }

  //insert new node with given value
  insert(val, currentNode = this.root) {
    console.log("trying to insert " + val);
    //if no node, create a node
    if (currentNode === null) {
      console.log("No node here. Adding this node:" + val);
      return Node(val);
    }

    //if same value in tree, do nothing
    if (currentNode.value === val) {
      console.log(
        "Value " + val + " already exists in the tree. Will not add."
      );
      return;
    }

    if (currentNode.value > val) {
      console.log(
        "current node:" + currentNode.value + " > " + val + ". checking left"
      );
      currentNode.leftChild = this.insert(val, currentNode.leftChild);
    } else {
      console.log(
        "current node:" + currentNode.value + " < " + val + ". checking right"
      );
      currentNode.rightChild = this.insert(val, currentNode.rightChild);
    }

    return currentNode;
  }

  //remove node with given value
  delete(val) {
    console.log("DELETE " + val);
    const removeNode = (node, val) => {
      try {
        node.value;
        console.log("NODE: " + node.value);
      } catch (e) {
        console.log("NODE: null");
      }

      if (node === null) {
        console.log("node is null. return null");
        return null;
      }

      if (node.value === val) {
        console.log("node " + node.value + " same as val to delete : " + val);

        //node with no children
        if (node.leftChild === null && node.rightChild === null) {
          console.log("node " + node.value + " with no children. return null");
          return null;
        }

        //node with only right child
        if (node.leftChild === null) {
          console.log(
            "node " +
              node.value +
              " with right child only. return right child: " +
              node.rightChild.value
          );
          return node.rightChild;
        }

        //node with only left child
        if (node.rightChild === null) {
          console.log(
            "node " +
              node.value +
              " with left child only. return left child: " +
              node.leftChild.value
          );
          return node.leftChild;
        }

        console.log("node " + node.value + " has two child");

        //node with two children
        let tempNode = node.rightChild;
        console.log(
          "temp node with val of node " +
            node.value +
            "'s right child: " +
            node.rightChild.value
        );

        //keep looking for most left node
        while (tempNode.leftChild !== null) {
          tempNode = tempNode.leftChild;
        }

        console.log(
          "temp node now is the left most node with value: " + tempNode.value
        );
        console.log("before: node value " + node.value);
        node.value = tempNode.value;
        console.log(
          "after assigning tempNode value to node: node value " + node.value
        );

        node.rightChild = removeNode(node.rightChild, tempNode.value);

        try {
          node.rightChild.value;
          console.log(
            "node " + node.value + " right child: " + node.rightChild.value
          );
        } catch {
          console.log("node " + node.value + " right child: null");
        }

        return node;
      } else if (node.value > val) {
        console.log(
          "current node value > val to delete: " +
            node.value +
            " > " +
            val +
            ". check left..."
        );

        node.leftChild = removeNode(node.leftChild, val);
        return node;
      } else {
        console.log(
          "current node value < val to delete: " +
            node.value +
            " < " +
            val +
            ". check right..."
        );
        node.rightChild = removeNode(node.rightChild, val);
        return node;
      } //else
    }; //removenode

    this.root = removeNode(this.root, val);
    console.log("root: " + this.root.value);
  } //delete

  //find the node with given value
  find(val, node = this.root) {
    try {
      node.value;
      console.log("finding " + val + ", current node: " + node.value);
    } catch (e) {
      console.log("current node is null");
    }

    if (node === null || node.value === val) {
      if (node === null) {
        return false;
      } else {
        return true;
      }
    }

    if (node.value < val) {
      console.log(node.value + " < " + val + ". checking right...");
      return this.find(val, node.rightChild);
    } else {
      console.log(node.value + " > " + val + ". checking left...");
      return this.find(val, node.leftChild);
    }
  }

  //breadth-first order
  levelOrder(arr = [], queue = [], node = this.root) {
    if (node === null) return;

    //read the current node value
    arr.push(node.value);

    //add the children of the node to the queue
    queue.push(node.leftChild);
    queue.push(node.rightChild);

    while (queue.length) {

      //first element in queue
      const level = queue[0];
      //remove the first element in queue
      queue.shift();
      this.levelOrder(arr, queue, level);
    }

    return arr;
  }

  //depth-first order -preorder/inorder/postorder
  //root->left->right
  preorder(arr = [], node = this.root) {
    if (node === null) return;

    arr.push(node.value);

    //visit left subtree
    if (node.leftChild) this.preorder(arr, node.leftChild);
    //visit right subtree
    if (node.rightChild) this.preorder(arr, node.rightChild);

    return arr;
  }

  //left->root->right
  inorder(arr = [], node = this.root) {
    if (node === null) return;

    if (node.leftChild) this.inorder(arr, node.leftChild);
    arr.push(node.value);
    if (node.rightChild) this.inorder(arr, node.rightChild);

    return arr;
  }

  //left->right->root
  postorder(arr = [], node = this.root) {
    if (node === null) return;

    if (node.leftChild) this.postorder(arr, node.leftChild);
    if (node.rightChild) this.postorder(arr, node.rightChild);
    arr.push(node.value);

    return arr;
  }

  //height of a node = number of edges in longest path from a given node to a leaf node
  //height of tree = height of root
  height(node = this.root) {
    if (node === null) return -1;

    const leftHeight = this.height(node.leftChild);
    const rightHeight = this.height(node.rightChild);

    //return max height+1
    return Math.max(leftHeight, rightHeight) + 1;
  }

  //number of edges in path from root to given node
  depth(val, node = this.root, edgeCount = 0) {
    if (node === null) return;
    if (node.value === val) return edgeCount;

    if (node.value < val) {
      return this.depth(val, node.rightChild, edgeCount + 1);
    } else {
      return this.depth(val, node.leftChild, edgeCount + 1);
    }
  }

  //difference between heights of left subtree and right subtree of every node is not more than 1
  isBalanced(node = this.root) {
    const leftHeight = this.height(node.leftChild);
    const rightHeight = this.height(node.rightChild);
    console.log("left subtree height: " + leftHeight);
    console.log("right subtree height: " + rightHeight);
    const diff = Math.abs(leftHeight - rightHeight);
    console.log("height difference: " + diff);
    return diff <= 1 ? "true" : "false";
  }

  rebalance() {
    //use inorder traversal method to sort the elements, then build the new tree from the sorted elements
    const inorderList = this.inorder();
    this.root = this.buildTree(inorderList);
  }

  //visualize tree function given by TOP assignment
  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.rightChild !== null) {
      this.prettyPrint(
        node.rightChild,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.leftChild !== null) {
      this.prettyPrint(
        node.leftChild,
        `${prefix}${isLeft ? "    " : "│   "}`,
        true
      );
    }
  }
}

//creates a new array with the given length with random number between 1 and 100
const randomArr = Array.from(
  { length: 10 },
  () => Math.floor(Math.random() * 100) + 1
);

//create tree
//const tree = new Tree(randomArr);
const tree = new Tree([6, 45, 55, 67, 3, 23, 2, 32, 1, 0, 49, 100, 4]);
tree.prettyPrint();
tree.insert(24);
tree.prettyPrint();
tree.delete(23);
tree.prettyPrint();
console.log("23 found in the tree : " + tree.find(23));
console.log("24 found in the tree : " + tree.find(24));
console.log("45 found in the tree : " + tree.find(45));
console.log("68 found in the tree : " + tree.find(68));
tree.prettyPrint();
console.log("level order : " + tree.levelOrder());
console.log("preorder (root-left-right) : " + tree.preorder());
console.log("inorder (left-root-right) : " + tree.inorder());
console.log("postorder  (left-right-root): " + tree.postorder());
console.log("tree height: " + tree.height());
tree.insert(5);
tree.prettyPrint();
console.log("tree height: " + tree.height());
console.log("depth of 5: " + tree.depth(5));
console.log("depth of 3: " + tree.depth(3));
console.log("depth of 45: " + tree.depth(45));
console.log("balanced tree: " + tree.isBalanced());
tree.insert(33);
tree.insert(34);
tree.insert(35);
tree.prettyPrint();
console.log("balanced tree (<=1): " + tree.isBalanced());
console.log("rebalance the tree...");
tree.rebalance();
tree.prettyPrint();
console.log("balanced tree (<=1): " + tree.isBalanced());
console.log("level order : " + tree.levelOrder());
console.log("preorder (root-left-right) : " + tree.preorder());
console.log("inorder (left-root-right) : " + tree.inorder());
console.log("postorder  (left-right-root): " + tree.postorder());
console.log("tree height: " + tree.height());
