import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-average',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './average.html',
  styleUrls: ['./average.css']
})
export class AverageComponent {
  // Array of different sentences for typing practice
  sentences: string[] = [
    "Stay positive, work hard, and success will be knocking on your door.",
    "The only way to do great work is to love what you do.",
    "Excellence is not a skill. It is an attitude.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Strive for progress, not perfection.",
    "The only limit to our realization of tomorrow will be our doubts of today.",
    "Don't watch the clock; do what it does. Keep studying.",
    "Your education is a dress rehearsal for a future that is yours to design.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "It does not matter how slowly you go, as long as you do not stop."
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