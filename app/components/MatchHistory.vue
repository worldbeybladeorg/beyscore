<script setup lang="ts">
const store = useScoreboardStore();
</script>

<template>
  <div v-if="store.history.length > 0" class="mt-4">
    <h4 class="text-center">Score History</h4>
    <Table class="table-bordered table">
      <TableHeader>
        <TableRow>
          <TableHead>{{ store.player1Name }} Score</TableHead>
          <TableHead>{{ store.player2Name }} Score</TableHead>
          <TableHead>Reason</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(entry, index) in store.history" :key="index">
          <TableCell>{{ entry.player1Score }}</TableCell>
          <TableCell>{{ entry.player2Score }}</TableCell>
          <TableCell>{{ entry.reason }}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{{ store.player1Score }}</TableCell>
          <TableCell>{{ store.player2Score }}</TableCell>
          <TableCell>{{ store.scoreReason }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
