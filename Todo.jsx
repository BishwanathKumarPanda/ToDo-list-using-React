import React, { useState, useEffect } from "react";
import { FaSun, FaMoon, FaUndo, FaTrash, FaCopyright } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [undoStack, setUndoStack] = useState([]);

  const handleInputChange = (text) => {
    setInputText(text);
  };

  const handleAddTask = () => {
    if (inputText.trim() !== '') {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
      const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
      const taskWithDateTime = `${inputText} - ${formattedDate} ${formattedTime}`;
      setTasks([...tasks, { text: taskWithDateTime, completed: false }]);
      setInputText('');
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    const deletedTask = updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    setUndoStack([...undoStack, deletedTask[0]]);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastDeletedTask = undoStack.pop();
      setTasks([...tasks, lastDeletedTask]);
      setUndoStack(undoStack);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  useEffect(() => {
    const correctedText = autocorrect(inputText);
    setInputText(correctedText);
  }, [inputText]);

  const autocorrect = (text) => {
    const suggestions = {
      'tod': 'to-do',
      'ap': 'app',
      'wrogn': 'wrong',
    };
    const words = text.split(' ');
    const correctedWords = words.map((word) => {
      return suggestions[word.toLowerCase()] || word;
    });
    return correctedWords.join(' ');
  };

  const handleEmojiClick = (event, emojiObject) => {
    const emojiToAdd = emojiObject.emoji;
    setInputText((prevText) => prevText + emojiToAdd);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleVirtualKeyboardClick = (key) => {
    setInputText((prevText) => prevText + key);
  };

  const virtualKeyboardKeys = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
    'z', 'x', 'c', 'v', 'b', 'n', 'm',
    '@', '.', ',',
  ];

  const toggleVirtualKeyboard = () => {
    setShowVirtualKeyboard(!showVirtualKeyboard);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleTaskCompletionToggle = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  return (
    <div style={{ borderRadius: '5px', backgroundColor: isDarkMode ? '#333' : 'pink', color: isDarkMode ? '#fff' : '#000', padding: '20px', marginBottom: '20px', width: '400px' }}>
      <h2 style={{ textAlign: 'center', color: isDarkMode ? '#fff' : '#000' }}>To Do List</h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ borderRadius: '5px', backgroundColor: isDarkMode ? '#444' : 'lightyellow', padding: '10px', marginRight: '10px' }}>Enter Text</div>
          <input type="text" value={inputText} onChange={(e) => handleInputChange(e.target.value)} placeholder="Enter Text" style={{ borderRadius: '5px', padding: '10px', backgroundColor: isDarkMode ? '#555' : '#fff', color: isDarkMode ? '#fff' : '#000' }} onKeyPress={handleKeyPress} />
        </div>
        <div>
          <button onClick={handleAddTask} style={{ borderRadius: '5px', backgroundColor: 'lightyellow', marginLeft: '10px', padding: '10px' }}>Add</button>
          <button onClick={toggleEmojiPicker} style={{ borderRadius: '5px', backgroundColor: 'lightyellow', marginLeft: '10px', padding: '10px' }}>😊</button>
          <button onClick={toggleVirtualKeyboard} style={{ borderRadius: '5px', backgroundColor: 'lightyellow', marginLeft: '10px', padding: '10px' }}>ABC</button>
          <button onClick={toggleDarkMode} style={{ borderRadius: '5px', backgroundColor: 'lightyellow', marginLeft: '10px', padding: '10px' }}>{isDarkMode ? <FaSun /> : <FaMoon />}</button>
        </div>
      </div>
      {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
      {showVirtualKeyboard && (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {virtualKeyboardKeys.map((key) => (
            <button key={key} onClick={() => handleVirtualKeyboardClick(key)} style={{ borderRadius: '5px', backgroundColor: 'lightyellow', margin: '5px', padding: '10px' }}>{key}</button>
          ))}
        </div>
      )}
      <ul>
        {tasks.map((task, index) => (
          <li key={index} style={{ textDecoration: task.completed ? 'line-through' : 'none', marginBottom: '5px', backgroundColor: isDarkMode ? '#444' : 'lightyellow', padding: '10px', borderRadius: '5px' }}>
            <span onClick={() => handleTaskCompletionToggle(index)}>{task.text}</span>
            <button onClick={() => handleDeleteTask(index)} style={{ marginLeft: '10px' }}><FaTrash /></button>
          </li>
        ))}
      </ul>
      <button onClick={handleUndo} style={{ borderRadius: '5px', backgroundColor: 'lightyellow', padding: '10px' }}><FaUndo /> Undo</button>
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px' }}>
        Made with <span style={{ color: 'red' }}>&#10084;</span> by Your Name
      </div>
      <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
        <FaCopyright />
        2024 Emoji Todo List. All rights reserved.
      </div>
    </div>
  );
};

export default TodoApp;
