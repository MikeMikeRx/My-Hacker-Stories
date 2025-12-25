import type { Story } from "../../types/story.types"
import Item from "./Item"

type Props ={
  list: Story[];
  onRemoveItem:(item: Story) => void;
};

const List = ({ list, onRemoveItem }: Props) => (
  <>
    <div className="list-header">
      <span>Title</span>
      <span>Author</span>
      <span>Comments</span>
      <span>Points</span>
      <span>Action</span>
    </div>
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>
      ))}
    </ul>
  </>
);

export default List;