import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-typing-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './typing-test.html',
  styleUrls: ['./typing-test.css']
})
export class TypingTestComponent {
  // Array of different sentences for typing practice
  sentences: string[] = [
    "The quick brown fox jumps over the lazy dog.",
    "Programming is the art of telling another human being what one wants the computer to do.",
    "Practice makes perfect.",
    "Life is what happens to you while you're busy making other plans.",
    "In the middle of difficulty lies opportunity.",
    "Success is not final, failure is not fatal.",
    "The only way to do great work is to love what you do.",
    " Stay hungry, stay foolish.",
    "Innovation distinguishes between a leader and a follower. Think different, think better.",
    "The future belongs to those who believe in the beauty of their dreams and work towards them.",
    "The best time to plant a tree was twenty years ago. The second best time is now.",
    "Happiness is the key to success and personal growth."
  ];

  paragraph: string = '';
  inputText: string = '';
  startTime!: number;
  elapsedTime: number = 0;
  wpm: number = 0;
  accuracy: number = 0;
  started: boolean = false;
  mode: 'light' | 'dark' = 'light';
  badges: string[] = [];

  constructor() {
    // Initialize with a random sentence
    this.selectRandomSentence();
  }

  selectRandomSentence() {
    const randomIndex = Math.floor(Math.random() * this.sentences.length);
    this.paragraph = this.sentences[randomIndex];
  }

  startTest() {
    if (!this.started) {
      this.started = true;
      this.startTime = Date.now();
    }
    this.calculateResults();
  }

  calculateResults() {
    const now = Date.now();
    this.elapsedTime = (now - this.startTime) / 1000 / 60; // in minutes

    const wordsTyped = this.inputText.trim().split(/\s+/).length;
    this.wpm = Math.round(wordsTyped / this.elapsedTime);

    const original = this.paragraph.slice(0, this.inputText.length);
    let correctChars = 0;
    for (let i = 0; i < this.inputText.length; i++) {
      if (this.inputText[i] === original[i]) {
        correctChars++;
      }
    }
    this.accuracy = Math.round((correctChars / this.inputText.length) * 100);

    if (this.wpm >= 50 && !this.badges.includes('50wpm')) {
      this.badges.push('50wpm');
    }
  }
  resetValues() {
  this.inputText = '';
  this.wpm = 0;
  this.accuracy = 0;
  this.elapsedTime = 0;
  this.started = false;
  this.startTime = 0;
}


  resetTest() {
    this.inputText = '';
    this.started = false;
    this.wpm = 0;
    this.accuracy = 0;
    this.elapsedTime = 0;
    // Select a new random sentence
    this.selectRandomSentence();
  }

  toggleMode() {
    this.mode = this.mode === 'light' ? 'dark' : 'light';
  }
}