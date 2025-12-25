import type { Story } from "../../types/story.types"

type Props = {
  item: Story;
  onRemoveItem:(item: Story) => void
};

const Item = ({ item, onRemoveItem }: Props) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type='button' onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
);

export default Item;