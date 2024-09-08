'use client';

/**
 * Notice that to make type inference feature and eslint works well, zustand and immer should both be installed using
 * npm.
 * Otherwise, some type checking feature with immer middleware will be incomplete.
 */
import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {plainToInstance} from "class-transformer";

// Algorithms
import {ProcessControlBlock} from '@/algorithm/schemes';
import {examplePcbListWithPriority, examplePcbListWithMFQ,} from '@/algorithm/examples';


interface AlgoConfigState {
  /**
   * Stores the list of ProcessControlBlock which will be used by simulator
   */
  pcbList: ProcessControlBlock[];

  /**
   * If using the recommended pcbList for each algorithm
   */
  useRecommend?: boolean;

  setUseRecommend: (value: boolean) => any;

  clearPcbList: () => void;

  /**
   * Add a ProcessControlBlock into the pcbList state.
   *
   * Notice that the pcbList will be sorted by pId after each addition.
   */
  addPcb: (pcb: ProcessControlBlock) => any;

  removePCb: (idx: number) => any;

  getPcbList: (key: 'mfq' | 'ps' | 'sjf') => ProcessControlBlock[];
}


export const useAlgoConfigStore = create<AlgoConfigState>()(
  persist(
    immer(
      (set, get) => ({

        pcbList: [],

        useRecommend: true,

        setUseRecommend(value) {
          set((st) => {
            st.useRecommend = value;
          })
        },

        clearPcbList() {
          set(st => {
            st.pcbList = []
          });
        },

        addPcb(pcb) {
          set(st => {

            // Add pcb into the list
            st.pcbList.push(pcb);

            // sort the new pcb list ordered by pId
            st.pcbList.sort(function (a, b) {
              if (a.pId < b.pId) return -1;
              else if (a.pId > b.pId) return 1;
              return 0;
            })
          });
        },

        removePCb(idx) {
          set(st => {
            st.pcbList.splice(idx, 1);
          })
        },

        getPcbList(algoType) {
          if (!get().useRecommend && get().pcbList && get().pcbList.length > 0) {
            console.log('Returning pcbList from state!');
            return plainToInstance(ProcessControlBlock, get().pcbList);
          }
          if (algoType == 'mfq') {
            return examplePcbListWithMFQ;
          } else {
            return examplePcbListWithPriority;
          }
        }
      }),
    ),
    {
      name: 'algo_config', // name of the item in the storage (must be unique)
    },
  ),
);