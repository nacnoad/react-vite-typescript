import { useEffect, useRef, useState } from 'react';
import { Character, useCharacters } from './api/charactersApi';
import { useAutocomplete } from '@mui/base';
import { styled } from '@mui/system';
import { FaTrash } from 'react-icons/fa';

function App() {
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [name, setName] = useState('');
  const { characters, isLoading, error, handleFetchNext, hasNext } =
    useCharacters(name);

  const loaderRef = useRef(null);

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
  } = useAutocomplete({
    id: 'rick-and-morty-characters',
    multiple: true,
    options: characters || [],
    getOptionLabel: (option) => option?.name || '',
    value: selectedCharacters,
    onChange: (event, newValue) => {
      if (newValue) {
        setSelectedCharacters(newValue);
        setName('');
      }
    },
    onInputChange: (event, newInputValue) => {
      setName(newInputValue);
    },
    isOptionEqualToValue: (option, value) => option.id === value.id,
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        handleFetchNext();
      }
    });
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [characters, handleFetchNext]);

  return (
    <div style={{ marginBottom: 16 }}>
      <Label {...getInputLabelProps()}>Pick a Rick and Morty Character</Label>
      <Root
        {...getRootProps()}
        className={focused ? 'Mui-focused' : ''}
      >
        {selectedCharacters.map((option: Character) => (
          <SelectedCharacter key={option.id}>
            {option.name}
            <DeleteButton
              onClick={() =>
                setSelectedCharacters((current) =>
                  current.filter((c) => c.id !== option.id)
                )
              }
            >
              <FaTrash />
            </DeleteButton>
          </SelectedCharacter>
        ))}
        <Input {...getInputProps()} />
      </Root>
      {groupedOptions.length > 0 && (
        <Listbox {...getListboxProps()}>
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              Loading ...
            </div>
          ) : (
            <>
              {(groupedOptions as typeof characters).map((option, index) => (
                <Option
                  {...getOptionProps({ option, index })}
                  key={option.id}
                >
                  <input
                    type='checkbox'
                    defaultChecked={selectedCharacters.some(
                      (sc) => sc.id === option.id
                    )}
                  />
                  <img
                    src={option.image}
                    width={32}
                    height={32}
                  />
                  <OptionWrapper>
                    <label>{option.name}</label>
                    <label>{option?.episode?.length} episodes</label>
                  </OptionWrapper>
                </Option>
              ))}
              {hasNext && <div ref={loaderRef}>{''}</div>}
            </>
          )}
        </Listbox>
      )}
      {error && <Error>{error}</Error>}
    </div>
  );
}

const blue = {
  100: '#DAECFF',
  200: '#99CCF3',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Label = styled('label')`
  display: block;
  font-family: sans-serif;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const Root = styled('div')(
  ({ theme }) => `
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[500]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
  };
  display: flex;
  gap: 1px 5px;
  padding: 8px;
  overflow: hidden;
  width: 320px;
  flex-wrap:wrap;

  &.Mui-focused {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === 'dark' ? blue[600] : blue[200]
    };
  }

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus-visible {
    outline: 0;
  }
`
);

const Input = styled('input')(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 0px 8px;
  outline: 0;
  flex: 1 0 auto;
`
);

const Listbox = styled('ul')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  width: 320px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  max-height: 300px;
  z-index: 1;
  position: absolute;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  box-shadow: 0px 2px 3px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.50)' : 'rgba(0,0,0, 0.05)'
  };
  `
);

const Option = styled('li')(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  display: flex;

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    cursor: pointer;
  }

  &[aria-selected=true] {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.Mui-focused,
  &.Mui-focusVisible {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }

  &.Mui-focusVisible {
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === 'dark' ? blue[500] : blue[200]
    };
  }

  &[aria-selected=true].Mui-focused,
  &[aria-selected=true].Mui-focusVisible {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }
  `
);

const OptionWrapper = styled('div')(
  `
  display: flex;
  flex-direction: column;
  gap: 5px;
  `
);

const Error = styled('div')(`
  color: red;
  `);

const SelectedCharacter = styled('div')(
  `
    display: flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
    background: ${grey[400]};
    border-radius: 8px;
    color: white;
    padding: 0px 4px;
    `
);

const DeleteButton = styled('button')(
  `
  border: none;
  color: white;
  text-align: center;
  -webkit-text-decoration: none;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: transparent;
  color: red;
  `
);

export default App;
