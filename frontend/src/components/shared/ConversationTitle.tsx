import "./conversationTitle.css"
export const ConversationTitle = ({name}: {name: string}) => {
    return (
        <div className="conversation-title">
            {name}
        </div>
    )
}