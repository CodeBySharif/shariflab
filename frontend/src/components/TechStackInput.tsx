import { useState, type KeyboardEvent } from 'react'
import { Box, Chip, TextField } from '@mui/material'
import { parseTechStack } from '../lib/techStack'

export default function TechStackInput({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [draft, setDraft] = useState('')
  const items = parseTechStack(value)

  const commit = () => {
    const tech = draft.trim().replace(/,$/, '')
    if (!tech) return
    if (!items.some((item) => item.toLowerCase() === tech.toLowerCase())) {
      onChange([...items, tech].join(', '))
    }
    setDraft('')
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      commit()
    } else if (event.key === 'Backspace' && !draft && items.length) {
      onChange(items.slice(0, -1).join(', '))
    }
  }

  return (
    <Box
      sx={{
        minHeight: 40,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 0.75,
        px: 1.5,
        py: 0.75,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
        '&:focus-within': { borderColor: 'primary.main', borderWidth: 2, px: '11px' },
      }}
    >
      {items.map((tech) => (
        <Chip
          key={tech}
          label={tech}
          size="small"
          onDelete={() => onChange(items.filter((item) => item !== tech).join(', '))}
          sx={{ borderRadius: 99 }}
        />
      ))}
      <TextField
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
        placeholder={items.length ? 'Add another…' : 'Add tech, then press Enter'}
        variant="standard"
        slotProps={{ input: { disableUnderline: true } }}
        sx={{ flex: 1, minWidth: 150, '& input': { py: 0, fontSize: '0.875rem' } }}
      />
    </Box>
  )
}
