<template>
  <div
    :class="[
      'bg-white/80 border border-slate-200 dark:bg-slate-900/70 dark:border-slate-700',
      'p-5 rounded-[24px] shadow-sm'
    ]"
  >
    <div
      :class="[
        'dark:text-slate-400 font-semibold text-slate-500 text-xs',
        'tracking-[0.3em] uppercase'
      ]"
    >
      Idea board
    </div>
    <h3 class="dark:text-slate-100 font-semibold mt-2 text-lg text-slate-900">
      New post ideas
    </h3>
    <p class="dark:text-slate-300 mt-1 text-slate-600 text-sm">
      Jot down a quick idea. We keep it in your browser.
    </p>

    <form class="gap-3 grid mt-4" @submit.prevent="addIdea">
      <input
        v-model.trim="title"
        :class="[
          'bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700',
          'dark:focus:border-slate-500 dark:focus:ring-slate-700 dark:text-slate-100',
          'focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200',
          'h-10 px-4 rounded-2xl shadow-sm text-slate-900 text-sm w-full'
        ]"
        placeholder="Idea title"
        required
      >
      <div class="gap-3 grid sm:grid-cols-[1fr_auto]">
        <select
          v-model="tag"
          :class="[
            'bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700',
            'dark:text-slate-200 h-10 px-3 rounded-2xl text-slate-700 text-sm w-full'
          ]"
        >
          <option value="general">
            General
          </option>
          <option value="feature">
            Feature
          </option>
          <option value="question">
            Question
          </option>
        </select>
        <button
          :class="[
            'bg-slate-900 dark:bg-slate-100 dark:text-slate-900 font-semibold',
            'px-4 py-2 rounded-full text-sm text-white'
          ]"
          type="submit"
        >
          Add
        </button>
      </div>
    </form>

    <div class="flex flex-wrap font-semibold gap-2 mt-4 text-xs">
      <span
        :class="[
          'border border-slate-200 dark:border-slate-700 dark:text-slate-300',
          'px-3 py-1 rounded-full text-slate-600'
        ]"
      >
        Total: {{ ideas.length }}
      </span>
      <span
        :class="[
          'border border-slate-200 dark:border-slate-700 dark:text-slate-300',
          'px-3 py-1 rounded-full text-slate-600'
        ]"
      >
        General: {{ counts.general }}
      </span>
      <span
        :class="[
          'border border-slate-200 dark:border-slate-700 dark:text-slate-300',
          'px-3 py-1 rounded-full text-slate-600'
        ]"
      >
        Feature: {{ counts.feature }}
      </span>
      <span
        :class="[
          'border border-slate-200 dark:border-slate-700 dark:text-slate-300',
          'px-3 py-1 rounded-full text-slate-600'
        ]"
      >
        Question: {{ counts.question }}
      </span>
    </div>

    <div
      v-if="ideas.length === 0"
      class="dark:text-slate-400 mt-4 text-slate-500 text-sm"
    >
      No ideas yet. Add one above.
    </div>

    <ul class="gap-2 grid mt-4">
      <li
        v-for="idea in ideas"
        :key="idea.id"
        :class="[
          'bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700',
          'flex items-center justify-between px-3 py-2 rounded-2xl'
        ]"
      >
        <div>
          <div class="dark:text-slate-100 font-semibold text-slate-900 text-sm">
            {{ idea.title }}
          </div>
          <div class="dark:text-slate-400 text-slate-500 text-xs">
            {{ labelFor(idea.tag) }}
          </div>
        </div>
        <button
          :class="[
            'dark:hover:text-slate-200 dark:text-slate-400 font-semibold',
            'hover:text-slate-700 text-slate-500 text-xs'
          ]"
          type="button"
          @click="removeIdea(idea.id)"
        >
          Remove
        </button>
      </li>
    </ul>

    <button
      v-if="ideas.length > 0"
      :class="[
        'dark:hover:text-slate-200 dark:text-slate-400 font-semibold',
        'hover:text-slate-700 mt-4 text-slate-500 text-xs'
      ]"
      type="button"
      @click="clearIdeas"
    >
      Clear all
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'


  type Idea = {
    id: string
    title: string
    tag: 'general' | 'feature' | 'question'
  }

  const storageKey = 'forum-idea-board'
  const title = ref('')
  const tag = ref<Idea['tag']>('general')
  const ideas = ref<Idea[]>([])

  const counts = computed(() => {
    return ideas.value.reduce(
      (acc, idea) => {
        acc[idea.tag] += 1

        return acc
      },
      { general: 0, feature: 0, question: 0 }
    )
  })

  const labelFor = (value: Idea['tag']) => {
    if (value === 'feature') return 'Feature'
    if (value === 'question') return 'Question'

    return 'General'
  }

  const loadIdeas = () => {
    const stored = localStorage.getItem(storageKey)
    if (!stored) return

    try {
      const parsed = JSON.parse(stored) as Idea[]
      if (Array.isArray(parsed)) {
        ideas.value = parsed
      }
    } catch {
      ideas.value = []
    }
  }

  const addIdea = () => {
    const next: Idea = {
      id: crypto.randomUUID(),
      title: title.value,
      tag: tag.value
    }
    ideas.value = [ next, ...ideas.value ]
    title.value = ''
    tag.value = 'general'
  }

  const removeIdea = (id: string) => {
    ideas.value = ideas.value.filter(idea => idea.id !== id)
  }

  const clearIdeas = () => {
    ideas.value = []
  }

  onMounted(loadIdeas)

  watch(
    ideas,
    value => {
      localStorage.setItem(storageKey, JSON.stringify(value))
    },
    { deep: true }
  )
</script>
