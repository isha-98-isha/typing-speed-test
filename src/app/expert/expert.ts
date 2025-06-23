import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expert',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expert.html',
  styleUrls: ['./expert.css']
})
export class ExpertComponent {
  // Array of different sentences for typing practice
  sentences: string[] = [
    "Programmers are not solitary creatures. They are trained to work together, to share code, and to help each other out.",
    "The best software is written by teams who know how to work together.",
    "Collaboration is key in programming. We must work together to solve complex problems and build amazing things.",
    "Programming is a team sport. It's not just about writing code, it's about collaborating with others to create something amazing.",
    "The best programmers are not necessarily the ones who know the most about programming, but the ones who can work effectively in a team.",
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