import { useState, type KeyboardEvent } from 'react'
import { Box, Chip, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material'
import { parseTechStack } from '../lib/techStack'

export default function TechStackInput({
  value,
  onChange,
  helperText,
}: {
  value: string
  onChange: (value: string) => void
  helperText?: string
}) {
  const [draft, setDraft] = useState('')
  const [focused, setFocused] = useState(false)
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
    <FormControl fullWidth size="small" variant="outlined">
      <InputLabel shrink htmlFor="tech-stack-input">
        Tech stack
      </InputLabel>
      <OutlinedInput
        id="tech-stack-input"
        label="Tech stack"
        notched
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          commit()
        }}
        placeholder={items.length ? 'Add another…' : focused ? 'Add tech, then press Enter' : ''}
        startAdornment={
          items.length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.75,
                mr: 0.75,
                maxWidth: '100%',
              }}
            >
              {items.map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  size="small"
                  onDelete={() => onChange(items.filter((item) => item !== tech).join(', '))}
                  sx={{ borderRadius: '4px' }}
                />
              ))}
            </Box>
          ) : undefined
        }
        sx={{
          alignItems: 'center',
          flexWrap: 'wrap',
          py: 0.5,
          minHeight: 44,
          '& .MuiOutlinedInput-input': {
            py: 0.75,
            minWidth: 120,
            flex: 1,
          },
        }}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}
