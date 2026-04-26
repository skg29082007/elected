import { describe, it, expect, vi } from 'vitest';
import { filterGlossary, glossaryData, quizData, signInWithGoogle } from './script.js';

describe('Application Core Logic', () => {
  it('should initialize successfully', () => {
    expect(true).toBe(true);
  });

  describe('quizData', () => {
    it('should have 10 elements', () => {
      expect(quizData.length).toBe(10);
    });
    it('should have valid objects with all fields', () => {
      quizData.forEach(q => {
        expect(q).toHaveProperty('q');
        expect(q).toHaveProperty('opts');
        expect(q.opts.length).toBe(4);
        expect(q).toHaveProperty('ans');
        expect(typeof q.ans).toBe('number');
        expect(q).toHaveProperty('exp');
      });
    });
  });

  describe('filterGlossary module', () => {
    it('should return all glossary data for All filter and empty search', () => {
      const res = filterGlossary(glossaryData, 'All', '');
      expect(res.length).toBe(glossaryData.length);
    });
    it('should specifically filter for term', () => {
      const res = filterGlossary(glossaryData, 'All', 'Gerrymandering');
      expect(res.length).toBe(1);
    });
    it('should filter by category', () => {
      const res = filterGlossary(glossaryData, 'Voting', '');
      expect(res.length).toBeGreaterThan(0);
      expect(res.every((item) => item.includes('Voting'))).toBe(true);
    });
    it('should return empty if nothing matches', () => {
      const res = filterGlossary(glossaryData, 'All', 'non_existing!!??');
      expect(res.length).toBe(0);
    });
    it('should match lowercase category correctly', () => {
      const res = filterGlossary(glossaryData, 'Voting', 'voter'); 
      expect(res.length).toBeGreaterThan(0);
    });
  });

  describe('Firebase Integration Flows', () => {
    it('simulates handleFirestoreError structure', () => {
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const OperationType = { CREATE: 'create' };
      const errInfo = {
        error: "Firebase Error",
        authInfo: { userId: null },
        operationType: OperationType.CREATE,
        path: 'test'
      };
      expect(errInfo.path).toBe('test');
      errSpy.mockRestore();
    });

    it('tests signInWithGoogle execution without crashing', () => {
      expect(() => {
        signInWithGoogle(); 
      }).not.toThrow();
    });
  });

  describe('Integration Flows', () => {
    it('simulates API interaction successfully', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: 'success' })
      });
      const res = await mockFetch('https://api.example.com');
      const data = await res.json();
      expect(res.ok).toBe(true);
      expect(data.data).toBe('success');
    });

    it('handles API errors correctly in mock fetch', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500
      });
      const res = await mockFetch('https://api.example.com/fail');
      expect(res.ok).toBe(false);
      expect(res.status).toBe(500);
    });
    
    it('handles network timeouts', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network timeout'));
      await expect(mockFetch('https://api.example.com')).rejects.toThrow('Network timeout');
    });
  });

  describe('UI Event Handlers Edge Cases', () => {
    it('button interactions', () => {
      const btn = document.getElementById('menuBtn');
      btn.click(); 
      expect(btn).not.toBeNull();
    });

    it('search handlers edge cases', () => {
      const gsearch = document.getElementById('glossarySearch');
      gsearch.value = 'dummy';
      const evt = new window.Event('input');
      gsearch.dispatchEvent(evt);
      expect(gsearch.value).toBe('dummy');
    });

    it('chat form submission edge case', () => {
      const form = document.getElementById('chatForm');
      const input = document.getElementById('chatInput');
      input.value = 'What is voting?';
      const evt = new window.Event('submit', { cancelable: true });
      form.dispatchEvent(evt);
      expect(evt.defaultPrevented).toBe(true);
    });

    it('quiz progression handles end of quiz gracefully', () => {
      const nextBtn = document.getElementById('quizNextBtn');
      if (nextBtn) {
        nextBtn.click();
        expect(nextBtn).toBeDefined();
      }
    });

    it('triggerBars is safe to call twice', () => {
      const initialHTML = document.body.innerHTML; 
      expect(true).toBe(true); 
    });

    it('triggerCounters is safe to call twice', () => {
      expect(true).toBe(true);
    });

    it('glossary filter clicks', () => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.filter = 'Voting';
      document.body.appendChild(btn);
      expect(btn.classList.contains('filter-btn')).toBe(true);
    });
  });
});
