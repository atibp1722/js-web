// song node
class Node{
    constructor(song){
        this.song = song;
        this.prev = null;
        this.next = null;
    }
}

// doubly linked list representation of music player
class DoublyLinkedList{
    constructor(){
        // pointer to first song
        this.head = null;
        // pointer to last song
        this.tail = null;
        // currently active song
        this.current = null;
    }
    // add song at the end
    add(song){
        let newNode = new Node(song);
        // check playlist empty
        if (this.head === null){
            // first node becomes head, tail and active 
            this.head = newNode;
            this.tail = newNode;
            this.current = newNode;
        } else{
            // put song after current tail and update pointer to new tail
            newNode.prev = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;
        }
    }
    // move forward to circle back to first song if current song is at end
    next(){
        if (this.current.next !== null){
            // move to the next node
            this.current = this.current.next;
        } else{
            // circle back to first as the previous was the last
            this.current = this.head;
        }
        // currently active song
        return this.current.song;
    }
    // move backwards to circle back to last song if at first song
    previous(){
        if (this.current.prev !== null){
            // move to next node
            this.current = this.current.prev;
        } else{
            // circle back to last as the previous was the first
            this.current = this.tail;
        }
        // currently active song
        return this.current.song;
    }
}